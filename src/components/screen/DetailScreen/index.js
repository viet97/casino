import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import BaseScreen from '../BaseScreen';
import { Colors } from '../../../themes/Colors';
import HistoryScreen from '../HistoryScreen';
import CustomText from '../../common/Text';
import { ScrollableTabView } from '../../common';
import SVGIcon from '../../../../assets/SVGIcon';
import { insets } from '../../../utils/DeviceUtil';
import FireStoreModule from '../../../modules/FireStoreModule';
import FightScreen from '../FightScreen';
import SummaryScreen from '../SummaryScreen';
import NavigationService from '../../../navigation/NavigationService';
import { ROUTER_NAME } from '../../../navigation/NavigationConst';

class DetailScreen extends BaseScreen {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 0,
      game: this.props.route?.params?.game
    };

    this.displayName = 'DetailScreen';
  }

  async _componentDidMount() {
    this.gameListener = FireStoreModule.listenGameChange(this.props.route?.params?.game?.id, game => {
      this.setStateSafe({ game })
    })
  }

  async _componentUnMount() {
    this.gameListener && this.gameListener()
  }

  renderContent() {
    const { currentTab, game } = this.state
    return (
      <View style={styles.container}>
        <ScrollableTabView
          locked
          contentProps={{
            bounces: false,
            keyboardShouldPersistTaps: "handled"
          }}
          scrollWithoutAnimation
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
            <FightScreen
              game={game}
            />
          </View>
          <View
            style={{
              flex: 1
            }}>
            <HistoryScreen
              game={game} />
          </View>
          <View
            style={{
              flex: 1
            }}>
            <SummaryScreen
              game={game} />
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
              size={9}
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
              backgroundColor: currentTab == 1 ? Colors.violet : Colors.TRANSPARENT
            }}>
            <SVGIcon.history width={32} height={32} />
            <CustomText
              size={9}
              style={styles.bottomText}>
              LỊCH SỬ
            </CustomText>
          </Pressable>
          <Pressable
            onPress={() => this.scrollableTabView.goToPage(2)}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: "center",
              backgroundColor: currentTab == 2 ? Colors.violet : Colors.TRANSPARENT
            }}>
            <SVGIcon.summary width={32} height={32} />
            <CustomText
              size={9}
              style={styles.bottomText}>
              TỔNG KẾT
            </CustomText>
          </Pressable>
        </View>

        <Pressable
          onPress={() => this.back()}
          style={styles.back}>
          <SVGIcon.back
            width={50}
            height={50}
          />
        </Pressable>
        {currentTab !== 2 ? <Pressable
          onPress={() => NavigationService.getInstance().navigate({
            routerName: ROUTER_NAME.CREATE_GAME.name,
            params: {
              game: this.state.game,
            }
          })}
          style={styles.rightButton}>
          <SVGIcon.options
            width={50}
            height={50}
          />
        </Pressable> : <Pressable
          style={styles.rightButton}>
          <SVGIcon.share_summary
            width={112}
            height={52}
          />
        </Pressable>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rightButton: {
    position: "absolute",
    top: 52,
    right: 16
  },
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
