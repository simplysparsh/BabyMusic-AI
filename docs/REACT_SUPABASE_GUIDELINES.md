# React-Safe Database Update Patterns for Supabase

These guidelines ensure React properly detects changes and triggers rerenders when using Supabase real-time subscriptions.

## 1. Maintain Consistent Field Sets

Always include the exact same set of fields in updates for the same state transitions:

```typescript
// Good: Consistent fields for partial updates
await supabase.from('songs').update({
  audio_url: newUrl,
  error: null,
  retryable: false
  // task_id deliberately omitted
}).eq('id', songId);

// Good: Consistent fields for complete updates
await supabase.from('songs').update({
  audio_url: newUrl,
  error: null,
  retryable: false,
  task_id: null  // Added for complete state
}).eq('id', songId);
```

## 2. Field Omission vs Explicit Null

- **Omit fields** you want to leave unchanged (don't set to undefined)
- **Explicitly set fields to null** when you want to clear a value
- Never include a field with undefined value

```typescript
// ❌ Bad: Setting to undefined (may not trigger reactivity)
await supabase.from('songs').update({
  audio_url: newUrl,
  task_id: undefined  // Bad practice
}).eq('id', songId);

// ✅ Good: Omitting field entirely to preserve existing value
await supabase.from('songs').update({
  audio_url: newUrl
  // task_id deliberately omitted
}).eq('id', songId);

// ✅ Good: Explicitly setting to null to clear value
await supabase.from('songs').update({
  audio_url: newUrl,
  task_id: null  // Explicitly null
}).eq('id', songId);
```

## 3. Avoid Dynamic Object Building

Prefer hardcoded field lists over dynamic object building to ensure consistent field sets:

```typescript
// ❌ Risky: Dynamic object could include unexpected fields
const updateObj = { audio_url: newUrl };
if (isComplete) updateObj.task_id = null;
await supabase.from('songs').update(updateObj).eq('id', songId);

// ✅ Safe: Explicit field lists for each state
if (isComplete) {
  await supabase.from('songs').update({
    audio_url: newUrl,
    task_id: null
  }).eq('id', songId);
} else {
  await supabase.from('songs').update({
    audio_url: newUrl
    // task_id deliberately omitted
  }).eq('id', songId);
}
```

## 4. Document State-Changing Fields

Always add comments when a field affects React UI state:

```typescript
// Update with state transition
await supabase.from('songs').update({
  audio_url: newUrl,
  task_id: null  // <- Triggers UI state change from "generating" to "ready"
}).eq('id', songId);
```

## 5. Consistent Timestamp Handling

When using timestamps to force rerenders:

```typescript
// Always include the timestamp field in the same format for consistency
await supabase.from('songs').update({
  audio_url: newUrl,
  updated_at: new Date().toISOString()  // Force rerender trigger
}).eq('id', songId);
```

## 6. Special Case: Song State Transitions in TuneLoom

For the song generation workflow:

1. **Generating State**: Song has a non-null `task_id`
2. **Partially Ready State**: Song has both `task_id` and `audio_url` set
3. **Ready State**: Song has `audio_url` set but `task_id` is null

To maintain these states:

```typescript
// Initial creation - sets generating state
await supabase.from('songs').insert({
  task_id: apiTaskId,
  // other fields...
});

// Partial update - preserves generating state but adds audio
await supabase.from('songs').update({
  audio_url: newUrl,
  error: null,
  retryable: false
  // task_id deliberately omitted to preserve generating state
}).eq('id', songId);

// Complete update - transitions to ready state
await supabase.from('songs').update({
  audio_url: finalUrl,
  error: null,
  retryable: false,
  task_id: null  // Explicitly clear task_id to trigger UI state change
}).eq('id', songId);
```

## 7. Advanced React Rendering Fixes

For reliable React rendering during state transitions, implement these additional patterns:

### 7.1 Force Re-rendering with `_lastUpdated` Property

Add a timestamp property to force React to detect changes:

```typescript
// When transitioning states, always include _lastUpdated
await supabase.from('songs').update({
  audio_url: finalUrl,
  task_id: null,
  _lastUpdated: new Date().toISOString()  // Forces React to detect the change
}).eq('id', songId);
```

### 7.2 Special Handling for State Transitions

Create explicit handlers for difficult transitions:

```typescript
// Handle GENERATING → READY transition
function handleReadyTransition(song) {
  return {
    ...song,
    _lastUpdated: new Date().toISOString(),
    _stateTransition: 'GENERATING_TO_READY'
  };
}

// Handle FAILED transition
function handleFailedTransition(song) {
  return {
    ...song,
    _lastUpdated: new Date().toISOString(),
    _stateTransition: 'GENERATING_TO_FAILED'
  };
}
```

### 7.3 Component Key Generation

Use composite keys incorporating state information:

```tsx
// In React components, use keys that change with state transitions
<SongCard 
  key={`song-${song.id}-${song.task_id ? 'generating' : 'ready'}-${song._lastUpdated}`}
  song={song} 
/>
```

This ensures components re-render even when reference equality checks might fail.

### 7.4 Debug Logging

Add comprehensive logging for tracking state transitions:

```typescript
console.log(`Song state transition: ${previousState} → ${newState}`, {
  songId: song.id,
  previousTaskId: previousTaskId,
  newTaskId: song.task_id,
  hasAudio: !!song.audio_url,
  timestamp: new Date().toISOString()
});
```

## 8. RealtimeHandler Integration Patterns

When using the custom RealtimeHandler system, follow these patterns for optimal React integration:

### 8.1 Factory-Based Channel Creation

Use channel factories instead of direct channel creation for proper reconnection:

```typescript
// ✅ Good: Factory pattern for reliable reconnection
const songsChannelFactory: ChannelFactory = (supabase) => {
  return supabase
    .channel(`songs-${userId}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'songs',
      filter: `user_id=eq.${userId}`,
    }, (payload) => handleSongUpdate(payload, set, get, supabase));
};

// ❌ Avoid: Direct channel creation (doesn't survive reconnections)
const songsChannel = supabase.channel(`songs-${userId}`);
```

### 8.2 Proper Callback Integration

Structure subscription callbacks for clean React state updates:

```typescript
// Add channel with comprehensive callbacks
const cleanup = realtimeHandler.addChannel(songsChannelFactory, {
  onSubscribe: (channel) => {
    console.log(`📡 Connected to ${channel.topic}`);
    // Optional: Set connection status in React state
  },
  onTimeout: (channel) => {
    console.log(`⏰ Timeout in ${channel.topic}`);
    // Handle timeout in React state if needed
  },
  onError: (channel, error) => {
    console.error(`❌ Error in ${channel.topic}:`, error);
    // Update error state in React
    setError(`Connection error: ${error.message}`);
  }
});
```

### 8.3 Lifecycle Management

Properly integrate RealtimeHandler with React component lifecycle:

```typescript
// In React components or hooks
useEffect(() => {
  if (user) {
    // Start RealtimeHandler and setup subscriptions
    const cleanup = realtimeHandler.start();
    const subscriptionCleanup = setupSubscriptions(user.id);
    
    return () => {
      // Clean up both RealtimeHandler and subscriptions
      cleanup();
      subscriptionCleanup?.();
    };
  }
}, [user]);
```

### 8.4 State Update Patterns

Structure state updates to work well with RealtimeHandler reconnection:

```typescript
// Handle real-time updates with state deduplication
const handleSongUpdate = (payload, set, get, supabase) => {
  const { new: newSong, old: oldSong, eventType } = payload;
  
  set((state) => {
    // Always return new object reference for React reactivity
    return {
      ...state,
      songs: updateSongsArrayWithDeduplication(state.songs, newSong, eventType),
      lastUpdateTimestamp: Date.now() // Helps React detect changes
    };
  });
};
```

### 8.5 Error Recovery Integration

Integrate RealtimeHandler error recovery with React error boundaries:

```typescript
// Error boundary integration
const subscriptionCallbacks = {
  onError: (channel, error) => {
    // Log for debugging
    console.error(`Real-time error in ${channel.topic}:`, error);
    
    // Update React error state
    setConnectionError(error.message);
    
    // For critical errors, trigger error boundary
    if (error.message.includes('FATAL')) {
      throw new Error(`Critical real-time error: ${error.message}`);
    }
  },
  onSubscribe: (channel) => {
    // Clear previous errors on successful reconnection
    setConnectionError(null);
    console.log(`Reconnected to ${channel.topic}`);
  }
};
```

By following these patterns, the RealtimeHandler system integrates seamlessly with React's reactivity model while providing robust real-time functionality. 