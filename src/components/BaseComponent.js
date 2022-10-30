import * as React from 'react';
import Config from '../Config';

export default class BaseComponent extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = 'BaseComponent';
    this.mounted = true;
    this.debug = Config.debug;
  }

  componentDidMount() {
    this._componentDidMount && this._componentDidMount();
  }

  componentWillUnmount() {
    this.mounted = false;
    this._componentWillUnmount && this._componentWillUnmount();
  }

  callbackSafe = (cb, ...arg) => {
    if (!this.mounted) {
      return;
    }
    cb && cb.call(this, ...arg);
  };

  setStateSafe = (state, callback) => {
    this.callbackSafe(() => this.setState(state, callback));
  };

  renderContent() {
    return null;
  }

  render() {
    if (this.renderContent) {
      return this.renderContent();
    }
    return null;
  }
}

