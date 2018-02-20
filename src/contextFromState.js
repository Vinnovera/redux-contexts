import key from './key';

export default (state, contextName) => state[key] && state[key][contextName] || state;