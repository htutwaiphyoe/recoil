# Learn Recoil

01. Course Introduction

1. Overview & Setup
2. Atoms
3. Selectors
4. Families
5. State persistence
6. Suspense
7. Concurrent mode
8. State observation
9. Performance
10. Testing

02. Overview

History: recoil is the internal state management library for facebook, still experimental stage

Key features: 

1. Flexible shared state

    1. boilerplate free (no reducer)
    2. as simple as get/set
    3. allow for code splitting

2. Derived data
    
    1. data can be derived safely and simply from state and other derived data
    2. access derived data as the same as access state
    3. derived data can be synchronous or asynchronous 

3. App-wide state observation

    1. read any part of recoil state
    2. observe changes to state
    3. persist application state
    4. rehydration (backwards compatibility)

Why recoil use: when the component tree and state structure don't match, normal component => ancestor => other component, so unnecessary rerender, for the recoil, store state in outside of react, so only necessary components are rendered 