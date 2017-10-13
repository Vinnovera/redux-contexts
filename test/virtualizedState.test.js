import key from '../src/key';
import virtualizedState from '../src/virtualizedState';

describe('virtualizedState', () => {
  const state = {
    [key]: {
      'foo': { 'bar': 'baz' }
    }
  };

  it('should spread the context into the root state', () => {
    expect(virtualizedState(state, 'foo')).toEqual({
      [key]: {
        'foo': { 'bar': 'baz' }
      },
      'bar': 'baz'
    })
  });

  it('should return the state if context name is not found', () => {
    expect(virtualizedState(state, 'bar')).toEqual(state)
  });
});