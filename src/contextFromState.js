import key from './key';

export default (state, contextName) => state[key][contextName] || state;