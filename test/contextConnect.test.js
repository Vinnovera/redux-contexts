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

  beforeEach(() => {
    store = createInjectStore({
      reducer
    });
  });

  it('should compose components as a decorator', () => {
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

  it('should have support for mapStateToProps', () => {
    const mapStateToProps = state => ({
      test: state.test
    });

    @contextConnect(mapStateToProps)
    class Connected extends Component {
      render = () => <div>{ this.props.test.foo }</div>;
    }

    expect(mount(
      <Provider store={ store }>
        <ContextStoreProvider reducers={ { test: reducer } }>
          <Connected/>
        </ContextStoreProvider>
      </Provider>)
      .contains(<div>bar</div>)
    ).toBe(true);
  });
});