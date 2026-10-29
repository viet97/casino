import React from 'react';
import { Image, PermissionsAndroid, Platform, StyleSheet, View } from 'react-native';
import SVGIcon from '../../../../assets/SVGIcon';
import FireStoreModule from '../../../modules/FireStoreModule';
import AdsModule from '../../../modules/AdsModule';
import { ROUTER_NAME } from '../../../navigation/NavigationConst';
import NavigationService from '../../../navigation/NavigationService';
import { fetchAndActivate, getRemoteConfig, getValue } from '@react-native-firebase/remote-config';
import { AuthorizationStatus, getMessaging, getToken, requestPermission } from '@react-native-firebase/messaging';

import { Images } from '../../../themes/Images';
import { widthDevice } from '../../../utils/DeviceUtil';
import CustomText from '../../common/Text';
import BaseScreen from '../BaseScreen';
class SplashScreen extends BaseScreen {
  constructor(props) {
    super(props);
    this.state = {
      welcome_message: ""
    };
    this.displayName = 'SplashScreen';
  }

  async requestUserPermission() {
    try {
      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)
        }
      } else {
        const authStatus = await requestPermission(getMessaging());
        const enabled =
          authStatus === AuthorizationStatus.AUTHORIZED ||
          authStatus === AuthorizationStatus.PROVISIONAL;
        if (!enabled) return
      }
      await getToken(getMessaging())
    } catch (e) {
      console.error(e)
    }
  }

  async loadWelcomeMessage() {
    try {
      const remoteConfig = getRemoteConfig()
      remoteConfig.settings = {
        minimumFetchIntervalMillis: 7200000,
      }
      await fetchAndActivate(remoteConfig)
      const welcome_message = getValue(remoteConfig, 'welcome_message').asString();
      this.setStateSafe({ welcome_message })
    } catch (e) {
      console.error("remote config error:", e)
    }
  }

  async _componentDidMount() {
    this.requestUserPermission().finally(() => AdsModule.init())
    const delayPromise = new Promise(resolve => setTimeout(resolve, 3000))
    await Promise.all([
      delayPromise,
      this.loadWelcomeMessage(),
      FireStoreModule.auth()
    ])
    NavigationService.getInstance().reset({ routerName: ROUTER_NAME.HOME.name })
  }

  renderContent() {
    return (
      <View style={styles.container}>
        <View
          style={styles.header}>
          <SVGIcon.history width={24} height={24} />
          <CustomText
            style={{
              marginLeft: 12
            }}
            size={12}>
            Đang kết nối...
          </CustomText>
        </View>
        <Image
          style={styles.splashImage}
          source={Images.assets.splash.source}
        />
        <CustomText
          style={styles.text}
          size={12}>
          {this.state.welcome_message}
        </CustomText>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    lineHeight: 25,
    textAlign: 'center',
    marginTop: 24,
    minHeight: 150
  },
  header: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: "center"
  },
  splashImage: {
    height: widthDevice * 222 / 393,
    width: widthDevice,
    resizeMode: "contain",
    marginTop: 32
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: "#09121E",
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default SplashScreen
