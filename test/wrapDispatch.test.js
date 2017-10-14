import key from '../src/key';
import wrapDispatch from '../src/wrapDispatch';
import {
  createStore,
  applyMiddleware,
  combineReducers
} from 'redux';
import thunkMiddleware from 'redux-thunk';

const reducer = (state = {}, { payload }) => ({
  ...state,
  ...payload
});

const action = () => ({
  type: 'FOO',
  payload: {
    bar: 'baz'
  }
});


describe('wrapDispatch', () => {
  let store;

  beforeEach(() => {
    store = applyMiddleware(thunkMiddleware)(createStore)(
      combineReducers({
        [key]: combineReducers({
          test: reducer
        })
      }),
      {
        [key]: {
          test: {
            foo: 'bar'
          }
        }
      }
    );
  });

  it('should return an action with meta key', () => {
    const wrappedDispatch = wrapDispatch(store.dispatch, 'test');
    expect(wrappedDispatch(action())).toEqual({
      type: 'FOO',
      payload: {
        bar: 'baz'
      },
      meta: {
        __multireducerKey: 'test'
      }
    });
  });

  it('should supply thunk actions with wrapped dispatch', () => {
    const wrappedDispatch = wrapDispatch(store.dispatch, 'test');

    const thunkAction = () => dispatch => {
      expect(dispatch(action())).toEqual({
        type: 'FOO',
        payload: {
          bar: 'baz'
        },
        meta: {
          __multireducerKey: 'test'
        }
      });
    };

    wrappedDispatch(thunkAction())
  });

  it('should supply thunk actions with virtualized getState function', () => {
    const wrappedDispatch = wrapDispatch(store.dispatch, 'test');

    const thunkAction = () => (dispatch, getState) => {
      expect(getState()).toEqual({
        [key]: {
          'test': {
            foo: 'bar'
          }
        },
        foo: 'bar'
      });
    };

    wrappedDispatch(thunkAction())
  });
});