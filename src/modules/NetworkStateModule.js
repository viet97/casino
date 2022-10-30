import NetInfo from '@react-native-community/netinfo';

import {EmitterManager} from './EmitterManager';

const NetworkStateModule = {
  isConnected: true,
  type: null,
  details: {},
  isInternetReachable: true,
};

NetInfo.fetch().then((state) => {
  const {isInternetReachable, isConnected, type} = state;
  NetworkModule.isConnected = isConnected;
  NetworkModule.isInternetReachable = isInternetReachable;
  NetworkModule.type = type;
});

NetInfo.addEventListener((state) => {
  if (state.isConnected !== NetworkStateModule.isConnected) {
    NetworkStateModule.isConnected = state.isConnected;
    EmitterManager.getInstance().emit(
      EmitterManager.listEvent.NETWORK_CHANGE,
      state.isConnected
    );
  }
  NetworkStateModule.type = state.type;
  NetworkStateModule.details = state.details;
  NetworkStateModule.isInternetReachable = state.isInternetReachable;
});

export default NetworkStateModule;

export const NetworkModule = NetworkStateModule;
