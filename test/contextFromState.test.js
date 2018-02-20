import key from '../src/key';
import contextFromState from '../src/contextFromState';

describe('contextFromState', () => {
  const state = {
    [key]: {
      'foo': { 'bar': 'baz' }
    }
  };

  it('should return the context state', () => {
    expect(contextFromState(state, 'foo')).toEqual({
      'bar': 'baz'
    })
  });

  it('should return the state if context name is not found', () => {
    expect(contextFromState(state, 'bar')).toEqual(state)
  });
});