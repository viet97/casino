import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppStack } from './router/StackNavigator';
import RNExitApp from 'react-native-exit-app';

import NavigationService from './NavigationService';
import BaseElement from '../components/element/BaseElement';
import { IS_ANDROID } from '../utils/DeviceUtil';
import { EmitterManager } from '../modules/EmitterManager';

let isBack = false,
  timeoutVar = null;
export const navigationRef = null
export const checkDoublePress = () => {
  NavigationService.getInstance().showToast({
    message: '',
  });
  if (!isBack) {
    isBack = true;
    const backFunc = () => {
      isBack = false;
    };
    if (timeoutVar) {
      clearTimeout(timeoutVar);
      timeoutVar = null;
    }
    timeoutVar = setTimeout(backFunc, 2000);
    return true;
  }
  if (IS_ANDROID) {
    RNExitApp.exitApp();
  }
  return false;
};

class AppNavigator extends BaseElement {
  constructor(props) {
    super(props);
    this.displayName = 'AppNavigator';
  }
  _componentDidMount() {
    NavigationService.getInstance(this.navigation);
  }
  _componentWillUnmount() {
    NavigationService.clear();
  }

  getActiveRouteName = state => {
    const route = state.routes[state.index];

    if (route.state) {
      // Dive into nested navigators
      return this.getActiveRouteName(route.state);
    }

    return route.name;
  };

  _onStateChange = async state => {
    const previousRouteName = this.navigation.getCurrentRoute();
    const currentRouteName = this.getActiveRouteName(state);
    NavigationService.getInstance().setCurrentScreen(currentRouteName);
    EmitterManager.getInstance().emit(EmitterManager.listEvent.CHANGE_SCREEN, currentRouteName);
  };

  renderContent() {
    return (
      <NavigationContainer
        ref={ref => (this.navigation = ref)}
        {...this.props}
        onStateChange={this._onStateChange}>
        <AppStack />
      </NavigationContainer>
    );
  }
}

export default AppNavigator;
