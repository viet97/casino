import * as React from 'react';

import { BackHandler } from 'react-native';

import { Text } from '../common';
import BaseComponent from '../BaseComponent';
import NavigationService from '../../navigation/NavigationService';

export default class BaseScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.displayName = 'BaseScreen';
    this.useExitApp = true;
  }


  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    this._componentDidMount && this._componentDidMount();
  }

  onBackPress = () => { };

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
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
    return <Text>{this.displayName}</Text>;
  }

  back = () => {
    NavigationService.getInstance().goBack();
  };

  render() {
    return (
      <React.Fragment>
        {this.renderContent()}
      </React.Fragment>
    );
  }
}
