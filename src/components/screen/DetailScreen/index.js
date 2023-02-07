import React, { createRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import BaseScreen from '../BaseScreen';
import { Colors } from '../../../themes/Colors';
import HistoryScreen from '../HistoryScreen';
import CustomText from '../../common/Text';
import { ScrollableTabView } from '../../common';
import SVGIcon from '../../../../assets/SVGIcon';
import { insets, widthDevice } from '../../../utils/DeviceUtil';
import FireStoreModule from '../../../modules/FireStoreModule';
import FightScreen from '../FightScreen';
import SummaryScreen from '../SummaryScreen';
import NavigationService from '../../../navigation/NavigationService';
import { ROUTER_NAME } from '../../../navigation/NavigationConst';
import Tooltip from '../../element/Tooltip';
import LocalStorage, { DEFINE_KEY } from '../../../modules/LocalStorage';

class DetailScreen extends BaseScreen {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 0,
      game: this.props.route?.params?.game
    };

    this.displayName = 'DetailScreen';
    this.summaryRef = createRef()
  }

  async _componentDidMount() {
    this.gameListener = FireStoreModule.listenGameChange(this.props.route?.params?.game?.id, game => {
      this.setStateSafe({ game })
    })

    LocalStorage.getItem(DEFINE_KEY.WENT_TO_DETAIL).then(wentToDetail => {
      if (!wentToDetail) {
        setTimeout(() => {
          this.setStateSafe({ visibleHint: true })
          LocalStorage.setItem(DEFINE_KEY.WENT_TO_DETAIL, true)
        }, 500)
      }
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
              showHint={this.state.childrendHint}
              onCloseHint={() => this.setStateSafe({ childrendHint: false })}
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
              ref={this.summaryRef}
              game={game} />
          </View>
        </ScrollableTabView>
        <View
          style={{
            flexDirection: "row",
            height: 73 + (insets.bottom ? 16 : 0),
            backgroundColor: Colors.toyota,
          }}>
          <View
            style={{
              width: widthDevice / 3,
              height: 73 + (insets.bottom ? 16 : 0),
            }}>
            <Tooltip
              visible={this.state.visibleHint}
              onClose={() => {
                setTimeout(() => {
                  this.setStateSafe({
                    visibleHint1: true,
                    visibleHint: false
                  })
                }, 500)
              }}
              content="Ghi điểm"
            >
              <Pressable
                onPress={() => this.scrollableTabView.goToPage(0)}
                style={{
                  alignItems: 'center',
                  justifyContent: "center",
                  height: '100%',
                  width: widthDevice / 3,
                  backgroundColor: !currentTab ? Colors.violet : Colors.TRANSPARENT
                }}>
                <SVGIcon.fighting width={32} height={32} />
                <CustomText
                  size={9}
                  style={styles.bottomText}>
                  CHIẾN
                </CustomText>
              </Pressable>
            </Tooltip>
          </View>

          <View
            style={{
              width: widthDevice / 3,
              height: 73 + (insets.bottom ? 16 : 0),
            }}>
            <Tooltip
              visible={this.state.visibleHint1}
              onClose={() => {
                setTimeout(() => {
                  this.setStateSafe({
                    visibleHint2: true,
                    visibleHint1: false
                  })
                }, 500)
              }}
              content="Lịch sử các trận đấu"
            >
              <Pressable
                onPress={() => this.scrollableTabView.goToPage(1)}
                style={{
                  alignItems: 'center',
                  justifyContent: "center",
                  height: '100%',
                  width: widthDevice / 3,
                  backgroundColor: currentTab === 1 ? Colors.violet : Colors.TRANSPARENT
                }}>
                <SVGIcon.history width={32} height={32} />
                <CustomText
                  size={9}
                  style={styles.bottomText}>
                  LỊCH SỬ
                </CustomText>
              </Pressable>
            </Tooltip>
          </View>
          <View
            style={{
              width: widthDevice / 3,
              height: 73 + (insets.bottom ? 16 : 0),
            }}>
            <Tooltip
              visible={this.state.visibleHint2}
              onClose={() => {
                setTimeout(() => {
                  this.setStateSafe({
                    visibleHint2: false,
                    childrendHint: true
                  })
                }, 500)
              }}
              content="Xếp hạng trận đấu"
            >
              <Pressable
                onPress={() => this.scrollableTabView.goToPage(2)}
                style={{
                  alignItems: 'center',
                  justifyContent: "center",
                  height: '100%',
                  width: widthDevice / 3,
                  backgroundColor: currentTab === 2 ? Colors.violet : Colors.TRANSPARENT
                }}>
                <SVGIcon.summary width={32} height={32} />
                <CustomText
                  size={9}
                  style={styles.bottomText}>
                  TỔNG KẾT
                </CustomText>
              </Pressable>
            </Tooltip>
          </View>
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
          onPress={() => {
            this.summaryRef?.current && this.summaryRef.current.shareSummary()
          }}
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
