import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import wrapDispatch from './wrapDispatch';
import virtualizedState from './virtualizedState';

export default (mapStateToProps, mapDispatchToProps, mergeProps, options) => {
  const finalMapStateToProps = (state, ownProps) => {
    checkContextName(ownProps);
    const { contextName } = ownProps;
    const contextState = virtualizedState(state, contextName);

    if (mapStateToProps) {
      const mapped = mapStateToProps(contextState, ownProps, state);
      if (typeof mapped === 'function') {
        return mapped(contextState, ownProps, state);
      }
      return mapped;
    }
    return {};
  };

  const finalMapDispatchToProps = (dispatch, ownProps) => {
    checkContextName(ownProps);
    const { contextName } = ownProps;
    return mapDispatchToProps ? mapDispatchToProps(wrapDispatch(dispatch, contextName), ownProps) : {};
  };

  const checkContextName = ownProps => {
    if (!ownProps.contextName) {
      throw new Error('No context store provided. ', ownProps);
    }
  };

  return ComposedComponent => {
    const ConnectedComponent = connect(
      finalMapStateToProps,
      finalMapDispatchToProps,
      mergeProps,
      options
    )(ComposedComponent);

    return class ContextConnect extends Component {
      static contextTypes = {
        contextName: PropTypes.string,
      };

      render() {
        return (
          <ConnectedComponent
            { ...this.props }
            { ...this.context }
          />
        );
      }
    };
  };
};