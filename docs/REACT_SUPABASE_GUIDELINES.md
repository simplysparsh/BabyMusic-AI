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

## 6. Special Case: Song State Transitions in BabyMusic-AI

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

Following these patterns ensures React will reliably detect changes from Supabase, maintaining consistent UI state transitions across your application.

### Song Subscription Handlers (`src/store/song/handlers/songSubscriptionHandlers.ts`)

Handle state transitions reliably:

```typescript
// Inside handleSongUpdate

// ... determine old and new states ...

// Handle state transitions based on `SongStateService`
if (transitionToReady) {
  // Update song state
  batchUpdate(...);
}

// Handle FAILED transition
if (transitionToFailed) {
  batchUpdate(...);
}

// Handle GENERATING state updates (e.g., task ID change)
if (stillGenerating) {
  batchUpdate(...);
}
```

Example transitions:

```typescript
// Example transition: Song starts generating
_stateTransition: 'INITIAL_TO_GENERATING'

// Example transition: Webhook completes, song is ready
_stateTransition: 'GENERATING_TO_READY'

// Example transition: Generation fails
_stateTransition: 'GENERATING_TO_FAILED'
``` 