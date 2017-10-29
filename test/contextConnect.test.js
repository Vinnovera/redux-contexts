import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';

import contextConnect from '../src/contextConnect';
import ContextStoreProvider from '../src/ContextStoreProvider';
import { createInjectStore } from '../src/reduxInjector';
import key from '../src/key';

const reducer = (state = { foo: 'bar' }, { payload }) => ({
  ...state,
  ...payload
});

describe('contextConnect', () => {
  let store;

  const mapStateToProps = state => ({
    reducer: state.reducer
  });

  const mapDispatchToProps = dispatch => ({
    dispatch: data => dispatch({
      type: 'test',
      payload: data
    })
  });

  beforeEach(() => {
    store = createInjectStore(
      {
        reducer
      },
      {
        reducer: {
          bar: 'baz'
        }
      }
    );
  });

  it('should compose components', () => {
    @contextConnect()
    class Connected extends Component {
      render = () => <div>test</div>;
    }

    expect(mount(
      <Provider store={ store }>
        <ContextStoreProvider reducers={ {reducer} }>
          <Connected/>
        </ContextStoreProvider>
      </Provider>)
      .contains(<div>test</div>)
    ).toBe(true);
  });

  it('should compose pure components', () => {
    const Component = () => <div>test</div>;
    const Connected = contextConnect()(Component);

    expect(mount(
      <Provider store={ store }>
        <ContextStoreProvider reducers={ {reducer} }>
          <Connected/>
        </ContextStoreProvider>
      </Provider>)
      .contains(<div>test</div>)
    ).toBe(true);
  });

  it('should have support for a mapStateToProps factory function', () => {
    @contextConnect(() => mapStateToProps)
    class Connected extends Component {
      render = () => <div>{ this.props.reducer.foo }</div>;
    }

    const wrapper = mount(
      <Provider store={ store }>
        <ContextStoreProvider
          name="test"
          reducers={ {reducer} }
        >
          <Connected/>
        </ContextStoreProvider>
      </Provider>
    );

    expect(wrapper.html()).toEqual('<div>bar</div>');
  });

  it('should have support for mapStateToProps', () => {
    @contextConnect(mapStateToProps)
    class Connected extends Component {
      render = () => <div>{ this.props.reducer.foo }</div>;
    }

    const wrapper = mount(
      <Provider store={ store }>
        <ContextStoreProvider
          name="test"
          reducers={ {reducer} }
        >
          <Connected/>
        </ContextStoreProvider>
      </Provider>
    );

    expect(wrapper.html()).toEqual('<div>bar</div>');
  });

  it('should have a virtualized state in mapStateToProps', () => {
    const mapStateToProps = state => {
      expect(state).toEqual({
        [key]: {
          test: {
            reducer: {
              foo: 'bar'
            }
          }
        },
        reducer: {
          foo: 'bar'
        }
      });

      return {};
    };

    @contextConnect(mapStateToProps)
    class Connected extends Component {
      render = () => null;
    }

    mount(
      <Provider store={ store }>
        <ContextStoreProvider
          name="test"
          reducers={ {reducer} }
        >
          <Connected/>
        </ContextStoreProvider>
      </Provider>
    );

    expect(store.getState()).toEqual({
      [key]: {
        test: {
          reducer: {
            foo: 'bar'
          }
        }
      },
      reducer: {
        bar: 'baz'
      }
    });
  });

  it('should have support for mapDispatchToProps', () => {
    @contextConnect(undefined, mapDispatchToProps)
    class Connected extends Component {
      componentDidMount = () => {
        this.props.dispatch({
          bar: 'baz'
        })
      };

      render = () => null;
    }

    mount(
      <Provider store={ store }>
        <ContextStoreProvider
          name="test"
          reducers={ {reducer} }
        >
          <Connected/>
        </ContextStoreProvider>
      </Provider>
    );

    expect(store.getState()).toEqual({
      [key]: {
        test: {
          reducer: {
            foo: 'bar',
            bar: 'baz'
          }
        }
      },
      reducer: {
        bar: 'baz'
      }
    });
  });

  it('should isolate the different contexts', () => {
    @contextConnect(mapStateToProps, mapDispatchToProps)
    class Connected extends Component {
      componentDidMount = () => {
        this.props.dispatch(this.props.data)
      };

      render = () => <div>{ this.props.reducer.foo }</div>;
    }

    const wrapper = mount(
      <Provider store={ store }>
        <div>
          <ContextStoreProvider
            name="test"
            reducers={ {reducer} }
          >
            <Connected data={ { foo: 'bar' } }/>
          </ContextStoreProvider>
          <ContextStoreProvider
            name="test2"
            reducers={ {reducer} }
          >
            <Connected data={ { foo: 'baz' } }/>
          </ContextStoreProvider>
        </div>
      </Provider>
    );

    expect(wrapper.html()).toEqual('<div><div>bar</div><div>baz</div></div>');

    expect(store.getState()).toEqual({
      [key]: {
        test: {
          reducer: {
            foo: 'bar'
          }
        },
        test2: {
          reducer: {
            foo: 'baz'
          }
        }
      },
      reducer: {
        foo: 'baz',
        bar: 'baz'
      }
    });
  });

  it('should be able to connect to an existing context', () => {
    @contextConnect(mapStateToProps, mapDispatchToProps)
    class Connected extends Component {
      componentDidMount = () => {
        this.props.dispatch(this.props.data)
      };

      render = () => <div>{ this.props.reducer.foo }</div>;
    }

    const wrapper = mount(
      <Provider store={ store }>
        <div>
          <ContextStoreProvider
            name="test"
            reducers={ {reducer} }
          >
            <Connected data={ { foo: 'baz' } }/>
          </ContextStoreProvider>
          <ContextStoreProvider name="test">
            <Connected data={ { foo: 'qux' } }/>
          </ContextStoreProvider>
        </div>
      </Provider>
    );

    expect(wrapper.html()).toEqual('<div><div>qux</div><div>qux</div></div>');
  });

  it('should throw if no context is provided', () => {

    expect(() => {
      const Component = () => <div>test</div>;
      const Connected = contextConnect()(Component);

      mount(
        <Provider store={ store }>
          <Connected/>
        </Provider>
      )
    }).toThrow('No context store provided.');

  });
});