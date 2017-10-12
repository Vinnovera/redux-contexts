import { wrapAction } from 'multireducer';
import virtualizedState from './virtualizedState';

export default (dispatch, contextName) => {
  const wrappedDispatch = (action) => {
    let wrappedAction;
    if (typeof action === 'function') {
      wrappedAction = (dispatch, getState, extraArgument) => {
        const wrappedGetState = () => virtualizedState(getState(), contextName);
        return action(wrappedDispatch, wrappedGetState, { ...extraArgument, dispatch, getState, contextName });
      }
    } else if (typeof action === 'object') {
      wrappedAction = wrapAction(action, contextName);
    }
    return dispatch(wrappedAction);
  };

  return wrappedDispatch;
};
