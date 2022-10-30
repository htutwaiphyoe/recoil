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

03. Atoms - Basics

create atoms example. normal flow is hoist state to the page level component and pass down to the children. but the problem is when the component tree is super deep, it causes props drill (need to pass deep down). we can use ContextAPI, but we will use Recoil atoms.

Atoms need few options

1. unique key which must be serializable value that labels particular atom. useful for persisting state (key, value pairs)

2. default value for atom state

to use atoms state,import atoms and pass key and default value and use useRecoilState and pass atom. destructure to access. It can be shared synchronous state between components. Like multiple useState link up together. It use built-in react state management so it is compatible with React. But other state management libraries may not be. If only value is needed, use useRecoilValue and pass atoms. That returns only value of atoms.

Recoil state is stored outside of react.

***Recoil atom key should be unique due to serializable conflicts***

04. Selectors - Basics

selectors are used to derived data based on atom/selector states and to share that derived state between components. selectors need unique key and get function which will derive state and return value. get method can access the values of atoms and other selectors using from get argument which is also a method which accepts atoms or selectors and return current value of them. it will reevaluate if the dependency value changes.

to set value of selector value, add set method in selectors, it takes two arguments, first objects of recoil methods and newValue which is to be set. if we make selectors settable, need to use useRecoilState and destructure value and set function. without set method in selectors, cannot use useRecoilState. need to give type of newValue in selectors with typescript. to set newValue to the certain atom, pull set method from first argument and pass atom and newValue to that set method. it will work reactively due to single source of truth. if we have two atoms, need to sync manually both state. avoid duplicate state if we can derived other states from one state in react, get method from first argument is like get method in get method of selector. multiple atoms can be in one selector.

***Selectors automatically recompute if the dependency changes***
