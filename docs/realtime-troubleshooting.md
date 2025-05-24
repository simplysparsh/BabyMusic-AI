# Realtime WebSocket Troubleshooting

This document covers common issues with Supabase Realtime WebSocket connections and their solutions, particularly the "10-minute background tab" problem.

## Issue: Buttons Stop Working After App Is Idle

### Symptoms
- App works fine initially after loading
- After leaving the app open but switching to other tabs for 10+ minutes
- Buttons become unresponsive (Sign Out, Play, Generate, etc.)
- Real-time updates stop working
- Page refresh fixes the issue temporarily

### Root Cause
This issue occurs due to **browser timer throttling** in background tabs:

1. **Browser Behavior**: Modern browsers (Chrome, Edge, Safari) aggressively throttle JavaScript timers in background tabs to save battery
2. **WebSocket Heartbeat Failure**: Supabase Realtime connections rely on periodic heartbeats (every 30 seconds) to stay alive
3. **Connection Death**: When tabs are backgrounded for ~5-10 minutes, the heartbeat timers get throttled, causing WebSocket connections to timeout
4. **Silent Failure**: The connection dies but the app doesn't know, so UI elements that depend on real-time state become unresponsive

### Chrome Timer Throttling Rules
- **5+ minutes hidden**: Timers throttled to run once per minute
- **Chain count ≥ 5**: Additional throttling applied
- **30+ seconds silent**: Even more aggressive throttling

This breaks the 30-second WebSocket heartbeat requirement.

## Solution: Web Worker + Optimized Configuration

### 1. Enable Web Worker for Realtime (PRIMARY FIX)

**File: `src/lib/supabase.ts`**

```typescript
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    syncTabs: true
  },
  realtime: {
    worker: true,  // 🔑 Uses Web Worker for heartbeat
    heartbeatIntervalMs: 25000  // 🔑 25s (safer than 30s default)
  }
});
```

**Why this works:**
- **Web Workers aren't throttled** by browsers like main thread timers
- **Consistent heartbeat** maintains WebSocket connection in background tabs
- **Included in realtime-js v2.10.7+** (we have v2.11.2 ✅)

### 2. Store Reset on Sign-Out (SECONDARY FIX)

**Files: `src/store/authStore.ts`, `src/store/song/subscriptions.ts`, `src/store/songStore.ts`**

This prevents stale data between user sessions:

```typescript
// In authStore signOut method
const { useSongStore } = await import('./songStore');
useSongStore.getState().resetStore();

// In song subscriptions - prevent race conditions
if (state.isResetting) {
  console.log('[SUBSCRIPTION] Ignoring event - store is being reset');
  return;
}
```

### 3. Visibility Change Handler (OPTIONAL ENHANCEMENT)

**File: `src/hooks/useRealtime.ts`**

Reconnects subscriptions after long periods of inactivity:

```typescript
const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible') {
    const hiddenTime = performance.now() - (window as any).lastHiddenTime;
    if (hiddenTime > 5 * 60 * 1000) { // 5+ minutes
      // Reconnect subscriptions
      if (unsubscribe) unsubscribe();
      unsubscribe = setupSubscription(user.id);
    }
  } else {
    (window as any).lastHiddenTime = performance.now();
  }
};
```

## Verification Steps

### 1. Check Dependencies
```bash
npm list @supabase/realtime-js
# Should show v2.10.7 or higher
```

### 2. Verify WebSocket Connections
1. Open DevTools → Network tab → Filter by "WS"
2. Look for WebSocket connections with **Status: 101**
3. Connections should stay active (not constantly reconnecting)

### 3. Test Background Tab Behavior
1. Open app and sign in
2. Switch to another tab for 10-15 minutes
3. Return and immediately test buttons (Sign Out, Play, etc.)
4. **Expected**: Buttons respond immediately
5. **Before fix**: Buttons would be unresponsive

## Affected Features

This fix resolves issues with **any UI element that depends on**:

### ✅ Authentication State
- Sign Out button
- Profile updates
- Protected routes

### ✅ Real-time Data
- Song generation status updates
- Play count updates
- Favorite toggles
- New song notifications

### ✅ WebSocket-dependent Features
- Live updates from other users (if applicable)
- Real-time collaboration features
- Push notifications via WebSocket

## Technical Details

### Browser Timer Throttling Research
- **GitHub Issue**: [supabase/realtime-js#121](https://github.com/supabase/realtime-js/issues/121)
- **Chrome Documentation**: [Timer Throttling in Chrome 88](https://developer.chrome.com/blog/timer-throttling-in-chrome-88/)
- **Fix Implementation**: realtime-js v2.10.7 (October 2024)

### Alternative Solutions Considered
1. **Page Visibility API**: Only partially effective
2. **Service Workers**: Complex implementation, limited browser support for our use case
3. **Polling**: Less efficient than WebSocket heartbeat
4. **Server-side queuing**: Would require major architecture changes

### Why Web Workers Work
- **Not subject to timer throttling** in background tabs
- **Dedicated thread** for maintaining WebSocket connection
- **Browser support**: Excellent across modern browsers
- **Minimal overhead**: Single worker handles heartbeat efficiently

## Prevention Guidelines

### For Developers
1. **Always enable `worker: true`** for Supabase Realtime
2. **Use shorter heartbeat intervals** (20-25s instead of 30s+)
3. **Test background tab behavior** during development
4. **Monitor WebSocket connections** in production

### For Testing
1. **Test with realistic usage patterns** (switching tabs, long sessions)
2. **Use DevTools Network tab** to monitor WebSocket health
3. **Verify across different browsers** (Chrome, Safari, Firefox)
4. **Test on mobile devices** (additional power management considerations)

## Related Issues

This fix also resolves related problems:
- Real-time subscription not receiving updates
- Stale authentication state
- "Connection lost" scenarios
- Silent failures in background tabs

## Migration Notes

### Upgrading from Previous Versions
1. **Add realtime config** to Supabase client creation
2. **Verify realtime-js version** is v2.10.7+
3. **Test thoroughly** in development before deploying
4. **Monitor logs** for WebSocket connection health

### Backward Compatibility
- **Fully backward compatible** - no breaking changes
- **Progressive enhancement** - gracefully degrades if Web Workers unavailable
- **No user-facing changes** - improvement is transparent to users

## Success Metrics

After implementing this fix, you should observe:
- **Zero button unresponsiveness** after background tab periods
- **Consistent WebSocket connections** in DevTools
- **No user complaints** about app "freezing" or requiring refresh
- **Improved user retention** during long sessions 