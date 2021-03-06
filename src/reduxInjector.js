import { createStore, combineReducers } from 'redux';
import { set, has, unset } from 'lodash';

let store = {};
let combine = combineReducers;

const combineReducersRecurse = reducers => {
  // If this is a leaf or already combined.
  if (typeof reducers === 'function') {
    return reducers;
  }

  // If this is an object of functions, combine reducers.
  if (typeof reducers === 'object') {
    const combinedReducers = {};
    for (const key of Object.keys(reducers)) {
      combinedReducers[key] = combineReducersRecurse(reducers[key]);
    }
    return combine(combinedReducers);
  }

  // If we get here we have an invalid item in the reducer path.
  throw new Error({
    message: 'Invalid item in reducer tree',
    item: reducers
  });
};

export const createInjectStore = (initialReducers, ...args) => {
  store = createStore(
    combineReducersRecurse(initialReducers),
    ...args
  );

  store.injectedReducers = initialReducers;

  return store;
};

export const injectReducer = (key, reducer, force = false) => {
  // If already set, do nothing.
  if (has(store.injectedReducers, key) || force) return;

  set(store.injectedReducers, key, reducer);
  store.replaceReducer(combineReducersRecurse(store.injectedReducers));
};

export const removeReducer = key => {
  // If not set, do nothing
  if (!has(store.injectedReducers, key)) return;
  //Remove key from state (hot reload warning if not)
  const state = store.getState();
  unset(state, key);
  unset(store.injectedReducers, key);
  store.replaceReducer(combineReducersRecurse(store.injectedReducers));
};