import contextConnect from '../src/contextConnect';
import contextFromState from '../src/contextFromState';
import ContextStoreProvider from '../src/ContextStoreProvider';
import {
  createInjectStore,
  injectReducer,
  removeReducer
} from '../src/reduxInjector';
import * as mainExports from '../src/index';

describe('main exports', () => {
  it('should export the contextConnect function', () => {
    expect(mainExports.contextConnect).toBeInstanceOf(Function)
    expect(mainExports.contextConnect).toEqual(contextConnect);
  });
  it('should export the contextFromState function', () => {
    expect(mainExports.contextFromState).toBeInstanceOf(Function)
    expect(mainExports.contextFromState).toEqual(contextFromState);
  });
  it('should export the ContextStoreProvider function', () => {
    expect(mainExports.ContextStoreProvider).toBeInstanceOf(Function)
    expect(mainExports.ContextStoreProvider).toEqual(ContextStoreProvider);
  });
  it('should export the createInjectStore function', () => {
    expect(mainExports.createInjectStore).toBeInstanceOf(Function)
    expect(mainExports.createInjectStore).toEqual(createInjectStore);
  });
  it('should export the injectReducer function', () => {
    expect(mainExports.injectReducer).toBeInstanceOf(Function)
    expect(mainExports.injectReducer).toEqual(injectReducer);
  });
  it('should export the removeReducer function', () => {
    expect(mainExports.removeReducer).toBeInstanceOf(Function)
    expect(mainExports.removeReducer).toEqual(removeReducer);
  });
});