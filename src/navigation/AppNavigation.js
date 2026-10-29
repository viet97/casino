import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppStack } from './router/StackNavigator';

import NavigationService from './NavigationService';
import BaseElement from '../components/element/BaseElement';
import { EmitterManager } from '../modules/EmitterManager';

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
