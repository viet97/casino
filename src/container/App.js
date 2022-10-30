import * as React from 'react';
import { StatusBar } from 'react-native';
import { LogBox } from 'react-native';

import AppNavigation from '../navigation/AppNavigation';

import { Colors } from '../themes/Colors';
import { EmitterManager } from '../modules/EmitterManager';
import Loading from '../components/element/Loading';
import DialogGlobal from '../components/element/DialogGlobal';

import { RootSiblingParent, setSiblingWrapper } from 'react-native-root-siblings';
import OrientationModule from '../modules/OrientationModule';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import NavigationService from '../navigation/NavigationService';
import LoadingManager from '../components/element/Loading/LoadingManager';
import Config from '../Config';
import codePush from 'react-native-code-push';
import { AppState } from 'react-native';
import AppStateModule from '../modules/AppStateModule';

LogBox.ignoreAllLogs();

class AppContainer extends React.Component {
  constructor(props) {
    super(props);
    setSiblingWrapper((sibling) => (
      <View>{sibling}</View>
    ));
  }

  componentDidMount() {
    StatusBar.setHidden(false);
    OrientationModule.lockToPortrait();

    AppState.addEventListener('change', state => {
      if (state !== AppStateModule.appState) {
        AppStateModule.previousAppState = AppStateModule.appState;
        AppStateModule.appState = state;
        EmitterManager.getInstance().emit(
          EmitterManager.listEvent.APP_STATE_CHANGE,
          state,
        );
        if (AppStateModule.isComeForegroundFromBackground()) {
          EmitterManager.getInstance().emit(
            EmitterManager.listEvent.APP_STATE_CHANGE_TO_FOREGROUND
          );
        }
      }
    });

  }

  componentWillUnmount() {
    if (Config.buildRelease) {
      EmitterManager.clear();
      DialogGlobal.clear();
      NavigationService.clear();
      LoadingManager.clear();
    }
  }

  render() {
    return (
      <RootSiblingParent>
        <SafeAreaView edges={['right', 'left']} style={{ flex: 1, backgroundColor: Colors.white }}>
          <SafeAreaProvider>
            <StatusBar
              hidden={false}
              barStyle={'light-content'}
              translucent={true}
              backgroundColor={Colors.STATUS_BAR_COLOR}
            />
            <AppNavigation />
            <Loading />
          </SafeAreaProvider>
        </SafeAreaView>
      </RootSiblingParent>
    );
  }
}

let MyAppContainer = AppContainer;
// if (Config.useCodePush) {
//   const AppInfoManager = require('../AppInfoManager').default;
//   let codePushOptions = {
//     checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
//     deploymentKey: AppInfoManager.getInstance().getDeploymentKey(),
//   };
//   MyAppContainer = codePush(codePushOptions)(AppContainer);
// }

export default MyAppContainer;
