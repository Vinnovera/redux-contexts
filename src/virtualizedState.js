import contextFromState from './contextFromState';

export default (state, contextName) => ({
  ...state,
  ...contextFromState(state, contextName)
});