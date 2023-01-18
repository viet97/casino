import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import SVGIcon from '../../../../assets/SVGIcon';
import FireStoreModule from '../../../modules/FireStoreModule';
import { ROUTER_NAME } from '../../../navigation/NavigationConst';
import NavigationService from '../../../navigation/NavigationService';
import remoteConfig from '@react-native-firebase/remote-config';
import messaging from '@react-native-firebase/messaging';

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
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      messaging()
        .getToken()
    }
  }

  _componentDidMount() {
    this.requestUserPermission()
    remoteConfig().setConfigSettings({
      minimumFetchIntervalMillis: 7200000,
    });
    remoteConfig().fetchAndActivate().then((success) => {
      const welcome_message = remoteConfig().getValue('welcome_message').asString();
      this.setStateSafe({ welcome_message })
      const delayPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve("success")
        }, 3000)
      })

      return Promise.all([delayPromise,
        FireStoreModule.auth()
      ])
    }).then(() => {
      NavigationService.getInstance().reset({ routerName: ROUTER_NAME.HOME.name })
    });
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
