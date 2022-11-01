import {
  CommonActions,
  DrawerActions,
  StackActions,
} from '@react-navigation/native';
import { Keyboard, StyleSheet } from 'react-native';
import Toast from 'react-native-root-toast';
import DialogGlobal from '../components/element/DialogGlobal';
import isString from 'lodash.isstring';

let timeoutVar = null;

const defaulFunc = () => { };

export default class NavigationService {
  static getInstance(navigation) {
    if (!this._instance) {
      if (navigation) {
        this._instance = new NavigationService(navigation);
      }
    } else {
      if (navigation) {
        this.navigation = navigation;
      }
    }
    return this._instance;
  }
  static clear() {
    if (this._instance) {
      this._instance.destroy();
      delete this._instance;
    }
  }
  constructor(navigation) {
    this.displayName = 'NavigationService';
    this.navigation = navigation;
  }
  _checkNavigation() {
    return !!this.navigation && !!this.navigation.dispatch;
  }
  setCurrentScreen(displayName) {
    this.currentScreen = displayName;
  }
  getCurrentScreen() {
    return this.currentScreen;
  }
  getRootState() {
    if (!this._checkNavigation()) {
      return undefined;
    }
    return this.navigation.getRootState();
  }
  destroy() {
    if (this.navigation) {
      delete this.navigation;
    }
  }

  closeDrawer({ time = 0 } = { time: 0 }) {
    if (!this._checkNavigation()) {
      return;
    }
    if (timeoutVar) {
      clearTimeout(timeoutVar);
      timeoutVar = null;
    }
    const callback = () => {
      this.navigation.dispatch(DrawerActions.closeDrawer());
    };
    timeoutVar = setTimeout(callback, time);
  }
  navigate({ routerName, params }) {
    const currentRouteName = this.getCurrentScreen();
    if (!this._checkNavigation() || !routerName) {
      return;
    }
    const name = isString(routerName) ? routerName : routerName.name;
    Keyboard.dismiss();
    this.navigation.dispatch(
      CommonActions.navigate({
        name: name,
        params: params,
      })
    );
  }
  goBack({ n = 1 } = { n: 1 }) {
    if (!this._checkNavigation()) {
      return;
    }
    const popAction = StackActions.pop(n); // CommonActions.goBack();
    if (timeoutVar) {
      clearTimeout(timeoutVar);
      timeoutVar = null;
    }
    const callback = () => {
      this.navigation.dispatch(popAction);
    };
    timeoutVar = setTimeout(callback);
  }

  resetWithNewRoute = ({ routes, index = 0 }) => {
    if (!this._checkNavigation()) {
      return;
    }

    const resetAction = CommonActions.reset({
      index,
      routes,
    });
    if (timeoutVar) {
      clearTimeout(timeoutVar);
      timeoutVar = null;
    }
    const callback = () => {
      this.navigation.dispatch(resetAction);
    };
    timeoutVar = setTimeout(callback, 0);
  };

  reset({ routerName, params, time = 100 }) {
    if (!this._checkNavigation()) {
      return;
    }
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [
        {
          name: routerName,
          params: params,
        },
      ],
    });
    if (timeoutVar) {
      clearTimeout(timeoutVar);
      timeoutVar = null;
    }
    const callback = () => {
      this.navigation.dispatch(resetAction);
    };
    timeoutVar = setTimeout(callback, 0);
  }
  showToast(
    {
      message = '',
      second = 3,
      onShow = () => { },
      onHide = () => { },
      onShown = () => { },
      onHidden = () => { },
    } = {
        message: '',
        second: 3,
        onShow: () => { },
        onHide: () => { },
        onShown: () => { },
        onHidden: () => { },
      }
  ) {
    if (this.toast) {
      //not show duplicate toast
      if (this.previousMessage === message) {
        return;
      }
      Toast.hide(this.toast);
      this.toast = null;
    }
    const configToast = {
      duration: Toast.durations.LONG,
      position: -60,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
      onShow: () => {
        this.previousMessage = message;
        onShow();
      },
      onShown: onShown,
      onHide: onHide,
      onHidden: () => {
        this.previousMessage = '';
        onHidden();
      },
      useNativeDriver: true,
      textStyle: {
        fontFamily: "FVF Fernando 08",
        fontSize: 15
      }
    };
    this.toast = Toast.show(message, configToast);
    if (timeoutVar) {
      clearTimeout(timeoutVar);
      timeoutVar = null;
    }
    const callback = () => {
      Toast.hide(this.toast);
      this.toast = null;
    };
    timeoutVar = setTimeout(callback, second * 1000);
  }

  hideDialog() {
    DialogGlobal.getInstance().hideDialog();
  }
}

const styles = StyleSheet.create({});

export const NavigationServiceRq = NavigationService;
