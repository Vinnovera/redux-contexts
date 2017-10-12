# redux-contexts

![NPM Version](https://img.shields.io/npm/v/redux-contexts.svg?style=flat-square)

`redux-contexts` is a utility for adding redux reducers with separated states during runtime.
The library is forked from [redux-injector](https://github.com/randallknutson/redux-injector) by [@randallknutsson](https://github.com/randallknutsson) and is built upon on [multireducer](https://github.com/erikras/multireducer) by [@erikras](https://github.com/erikras)

## Installation

```
npm install --save redux-contexts
```

## Why?
This is a set of functions and higher order components (decorators) that lets you reuse your components And reducers in an isolated way.
When you find yourself wanting to have multiple instances of the same component and reducer, but with separated states and actions dispatches - this is what you need!

## Usage
Start by creating the redux store with the `createInjectStore` redux middleware
```JSX
import { createInjectStore } from 'redux-contexts';

let store = createInjectStore(
  reducersObject,
  initialState
);
```


Then wrap the components that you want to isolate with `ContextStoreProvider`
```javascript
import React from 'react';
import { ContextStoreProvider } from 'redux-contexts';
import OtherComponent from 'OtherComponent';
import anyReducer from 'anyReducer';

export default class AnyComponent extends React.Component {
  render() {
    return (
      <ContextStoreProvider reducers={ { anyReducer } }>
        <OtherComponent />
      </ContextStoreProvider>
    );
  }
}
```


Finally connect the component with `contextConnect` in the same way as react-redux connect
```javascript
import React from 'react';
import { contextConnect } from 'redux-contexts';
import OtherComponent from 'OtherComponent';
import someAction from 'someAction';

const mapStateToProps = state => ({
  someValue: state.anyReducer.someValue
});

const mapDispatchToProps = dispatch => ({
  someAction: () => dispatch(someAction()),
});

@contextConnect(mapStateToProps, mapDispatchToProps);
export default class OtherComponent extends React.Component {
}
```
