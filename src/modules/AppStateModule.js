import { AppState } from 'react-native';

const APP_STATE_TYPE = {
  ACTIVE: 'active',
  IN_ACTIVE: 'inactive',
  BACK_GROUND: 'background',
};

const AppStateModule = {
  previousAppState: AppState.currentState,
  appState: AppState.currentState,
  isActive: () => AppState.currentState === APP_STATE_TYPE.ACTIVE,
  isInActive: () => AppState.currentState === APP_STATE_TYPE.IN_ACTIVE,
  isBackground: () => AppState.currentState === APP_STATE_TYPE.BACK_GROUND,
  isComeForegroundFromBackground: () =>
    AppStateModule.previousAppState !== APP_STATE_TYPE.ACTIVE &&
    AppStateModule.isActive(),
};

export default AppStateModule;
