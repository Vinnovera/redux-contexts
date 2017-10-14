import {
  createInjectStore,
  injectReducer,
  removeReducer
} from '../src/reduxInjector';

const reducer = (state = {}, { payload }) => ({
  ...state,
  ...payload
});

describe('reduxInjector', () => {
  let store;

  beforeEach(() => {
    store = createInjectStore(
      {
        test: reducer
      }
    );
  });

  it('should create an injectable store with createInjectStore', () => {
    expect(store.getState()).toEqual({
      test: {}
    });
  });

  it('should inject reducer with injectReducer', () => {
    injectReducer('foo', reducer);
    expect(store.getState()).toEqual({
      test: {},
      foo: {}
    });
  });

  it('should throw an error when not injecting functions or objects', () => {
    expect(() => {
      injectReducer('foo', false)
    }).toThrow();
  });

  it('should remove reducer with removeReducer', () => {
    injectReducer('foo', reducer);
    removeReducer('foo');
    expect(store.getState()).toEqual({
      test: {}
    });
  });

  it('should return a store that responds to actions', () => {
    injectReducer('foo', reducer);
    store.dispatch({
      type: 'FOO',
      payload: {
        bar: 'baz'
      }
    });

    expect(store.getState()).toEqual({
      test: {
        bar: 'baz'
      },
      foo: {
        bar: 'baz'
      }
    });
  });
});