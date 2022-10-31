import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import BaseScreen from '../BaseScreen';
import { Colors } from '../../../themes/Colors';
import SplashScreen from '../SplashScreen';
import HistoryScreen from '../HistoryScreen';
import CustomText from '../../common/Text';
import { ScrollableTabView } from '../../common';
import SVGIcon from '../../../../assets/SVGIcon';
import { insets } from '../../../utils/DeviceUtil';

class DetailScreen extends BaseScreen {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 0
    };

    this.displayName = 'DetailScreen';
  }


  renderContent() {
    const { currentTab } = this.state
    return (
      <View style={styles.container}>
        <ScrollableTabView
          renderTabBar={() => <View />}
          ref={ref => this.scrollableTabView = ref}
          style={{ flex: 1 }}
          tabBarActiveTextColor={Colors.black}
          prerenderingSiblingsNumber={0}
          initialPage={0}
          onChangeTab={({ i }) => this.setStateSafe({ currentTab: i })}
        >
          <View
            style={{
              flex: 1
            }}>
            <SplashScreen />
          </View>
          <View
            style={{
              flex: 1
            }}>
            <HistoryScreen />
          </View>
        </ScrollableTabView>
        <View
          style={{
            flexDirection: "row",
            height: 73 + (insets.bottom ? 16 : 0),
            backgroundColor: Colors.toyota
          }}>
          <Pressable
            onPress={() => this.scrollableTabView.goToPage(0)}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: "center",
              backgroundColor: !currentTab ? Colors.violet : Colors.TRANSPARENT
            }}>
            <SVGIcon.fighting width={32} height={32} />
            <CustomText
              style={styles.bottomText}>
              CHIẾN
            </CustomText>
          </Pressable>
          <Pressable
            onPress={() => this.scrollableTabView.goToPage(1)}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: "center",
              backgroundColor: currentTab ? Colors.violet : Colors.TRANSPARENT
            }}>
            <SVGIcon.history width={32} height={32} />
            <CustomText
              style={styles.bottomText}>
              LỊCH SỬ
            </CustomText>
          </Pressable>
        </View>

        <Pressable
          onPress={() => this.back()}
          style={styles.back}>
          <SVGIcon.back
            width={52}
            height={52}
          />
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  back: {
    position: "absolute",
    top: 52,
    left: 16
  },
  bottomText: {
    color: Colors.white,
    marginTop: 4
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: Colors.backgroundScreen
  },
});

export default DetailScreen
