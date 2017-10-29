import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';
import { combineReducers } from 'redux';
import multireducer from 'multireducer';
import {
  injectReducer,
  removeReducer
} from './reduxInjector';
import isEmpty from 'lodash/isEmpty';
import key from './key';

export default class ContextStoreProvider extends Component {
  static propTypes = {
    name: PropTypes.string,
    reducers: PropTypes.objectOf(
      PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func
      ])
    ),
    removeOnUnmount: PropTypes.bool
  };

  static defaultProps = {
    name: uuid(),
    reducers: {},
    removeOnUnmount: false
  };

  static childContextTypes = {
    contextName: PropTypes.string
  };

  getChildContext() {
    return {
      contextName: this.props.name
    };
  }

  componentWillMount() {
    if (!isEmpty(this.props.reducers)) {
      injectReducer(
        `${ key }.${ this.props.name }`,
        multireducer(
          combineReducers(this.props.reducers),
          this.props.name
        )
      );
    }
  }

  componentWillUnmount() {
    if (!this.props.removeOnUnmount || isEmpty(this.props.reducers)) {
      return;
    }
    removeReducer(`${ key }.${ this.props.name }`);
  }

  render() {
    return this.props.children;
  }
}