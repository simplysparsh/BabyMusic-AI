# ESLint Error Fixing Guide

This guide provides safe methods to fix common ESLint errors in your React TypeScript codebase without breaking functionality.

## Unused Variables and Imports

**Problem:** Variables or imports that are defined but never used.
```
error: 'variableName' is defined but never used. Allowed unused vars must match /^_/u
```

**Safe Fix:** Prefix unused variables with an underscore
```typescript
// Before
function example(unusedParam: string) {
  // Never uses unusedParam
}

// After
function example(_unusedParam: string) {
  // Parameter is now marked as intentionally unused
}
```

For imports:
```typescript
// Before
import { ComponentA, ComponentB } from './components';
// Only ComponentA is used

// After
import { ComponentA, _ComponentB } from './components';
// Or better, remove the unused import completely:
import { ComponentA } from './components';
```

## React Hook Rules Violations

**Problem:** React hooks called conditionally
```
error: React Hook "useEffect" is called conditionally. React Hooks must be called in the exact same order in every component render
```

**Safe Fix:** Move hooks above conditional statements
```typescript
// Before
function MyComponent({ user }) {
  if (!user) return null;
  const [state, setState] = useState(initialState); // Error! Hook called conditionally
  
  // After
  function MyComponent({ user }) {
    const [state, setState] = useState(initialState); // Fixed! Hooks always called
    
    if (!user) return null;
    // ...rest of component
  }
}
```

## Missing useEffect Dependencies

**Problem:** Missing dependencies in effect hooks
```
warning: React Hook useEffect has a missing dependency: 'value'. Either include it or remove the dependency array
```

**Safe Fix:** Add the dependency and handle possible effects
```typescript
// Before
useEffect(() => {
  doSomething(value);
}, []); // Missing 'value' dependency

// After
useEffect(() => {
  doSomething(value);
}, [value]); // Added 'value' to dependencies
```

For functions as dependencies, wrap them in useCallback:
```typescript
// Before
const myFunction = () => {
  // Implementation
};

useEffect(() => {
  myFunction();
}, []);  // Warning! Missing myFunction dependency

// After
const myFunction = useCallback(() => {
  // Implementation
}, [dependencies]); // Wrap in useCallback with its own dependencies

useEffect(() => {
  myFunction();
}, [myFunction]); // Now stable across renders
```

## Any Type Usage

**Problem:** Using 'any' type
```
error: Unexpected any. Specify a different type
```

**Safe Fix:** Use more specific types or create interfaces
```typescript
// Before
function process(data: any) {
  // Implementation
}

// After
interface DataType {
  id: string;
  value: number;
  // Add other properties you need
}

function process(data: DataType) {
  // Implementation
}

// If type is truly unknown, use unknown instead of any
function process(data: unknown) {
  // Need to add type checks before using data
  if (typeof data === 'string') {
    // Now TypeScript knows data is a string
  }
}
```

## Learn More

For more comprehensive fixes to specific issues, consider working with the codebase file by file rather than through automated scripts. This ensures that functionality is preserved while improving code quality.

You can run `npx eslint --fix` for some automatic fixes, but always review the changes to ensure they haven't broken functionality. 