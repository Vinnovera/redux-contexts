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
    name: null,
    reducers: {},
    removeOnUnmount: false
  };

  static childContextTypes = {
    contextName: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.contextName = props.name || uuid();
    this.reducers = props.reducers || {};
  }

  getChildContext() {
    return {
      contextName: this.contextName
    };
  }

  componentWillMount() {
    if (!isEmpty(this.reducers)) {
      injectReducer(
        `${ key }.${ this.contextName }`,
        multireducer(
          combineReducers(this.reducers),
          this.contextName
        )
      );
    }
  }

  componentWillUnmount() {
    if (!this.props.removeOnUnmount || isEmpty(this.reducers)) {
      return;
    }
    removeReducer(`${ key }.${ this.contextName }`);
  }

  render() {
    return this.props.children;
  }
}