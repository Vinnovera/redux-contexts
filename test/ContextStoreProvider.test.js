import React from 'react';
import { shallow } from 'enzyme';

import ContextStoreProvider from '../src/ContextStoreProvider';
import { createInjectStore } from '../src/reduxInjector';
import key from '../src/key';

const reducer = (state = {}, { payload }) => ({
  ...state,
  ...payload
});

describe('ContextStoreProvider', () => {
  let store;

  beforeEach(() => {
    store = createInjectStore(
      {
        [key]: {
          test2: {
            reducer
          }
        }
      },
      {
        [key]: {
          test2: {
            reducer: {
              bar: 'baz'
            }
          }
        }
      }
    );
  });

  it('should render its children', () => {
    expect(
      shallow(
        <ContextStoreProvider>
          <div>test</div>
        </ContextStoreProvider>
      ).contains(
        <div>test</div>
      )
    ).toBe(true)
  });

  it('should inject reducers into store', () => {

    shallow(
      <ContextStoreProvider
        name="test"
        reducers={ { reducer }}
      />
    );

    expect(store.getState()).toHaveProperty(key);
    expect(store.getState()).toEqual({
      [key]: {
        test: {
          reducer: {}
        },
        test2: {
          reducer: {
            bar: 'baz'
          }
        }
      }
    })
  });

  it('should generate a unique context name with uuid when no name is specified', () => {
    const wrapper = shallow(
      <ContextStoreProvider
        reducers={ { reducer }}
      />
    );

    expect(wrapper.instance().props.name)
      //UUID
      .toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);

    expect(Object.keys(store.getState()[key])[1])
      //UUID
      .toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
  });

  it('should be able to provide an existing context', () => {
    const wrapper = shallow(
      <ContextStoreProvider
        name="test2"
      />
    );

    expect(wrapper.instance().props.reducers).toEqual({});

    expect(store.getState()).toEqual({
      [key]: {
        test2: {
          reducer: {
            bar: 'baz'
          }
        }
      }
    })
  });

  it('should be able to provide an existing context without overwriting existing reducers', () => {
    shallow(
      <ContextStoreProvider
        name="test2"
        reducers={ { reducer }}
      />
    );

    expect(store.getState()).toHaveProperty(key);
    expect(store.getState()).toEqual({
      [key]: {
        test2: {
          reducer: {
            bar: 'baz'
          }
        }
      }
    })
  });

  it('should not remove reducers on unmount', () => {
    const wrapper = shallow(
      <ContextStoreProvider
        name="test"
        reducers={ { reducer }}
      />
    );

    expect(store.getState()).toHaveProperty(key);
    expect(store.getState()).toEqual({
      [key]: {
        test: {
          reducer: {}
        },
        test2: {
          reducer: {
            bar: 'baz'
          }
        }
      }
    });

    wrapper.unmount();

    expect(store.getState()).toEqual({
      [key]: {
        test: {
          reducer: {}
        },
        test2: {
          reducer: {
            bar: 'baz'
          }
        }
      }
    });
  });

  it('should remove reducers on unmount when removeOnUnmount=true', () => {
    const wrapper = shallow(
      <ContextStoreProvider
        name="test"
        reducers={ { reducer }}
        removeOnUnmount
      />
    );

    expect(store.getState()).toHaveProperty(key);
    expect(store.getState()).toEqual({
      [key]: {
        test: {
          reducer: {}
        },
        test2: {
          reducer: {
            bar: 'baz'
          }
        }
      }
    });

    wrapper.unmount();

    expect(store.getState()).toEqual({
      [key]: {
        test2: {
          reducer: {
            bar: 'baz'
          }
        }
      }
    });
  });
});