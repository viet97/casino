import React, { createRef } from 'react';
import { FlatList, Image, Pressable, StyleSheet, View } from 'react-native';

import NavigationService from '../../../navigation/NavigationService';
import { Images } from '../../../themes/Images';
import { IS_ANDROID, widthDevice } from '../../../utils/DeviceUtil';
import { Colors } from '../../../themes/Colors';
import CustomText from '../../common/Text';
import SVGIcon from '../../../../assets/SVGIcon';
import Item from './Item';
import KeyboardScrollView from '../../element/KeyboardScrollView';
import BaseElement from '../../element/BaseElement';
import { cloneDeep, size } from 'lodash';
import FireStoreModule from '../../../modules/FireStoreModule';
import { MAX_MEMBER } from '../../../Define';
import Tooltip from '../../element/Tooltip';

class FightScreen extends BaseElement {
  constructor(props) {
    super(props);
    this.state = {};
    this.displayName = 'FightScreen';
    NavigationService.getInstance(props.navigation)
    this.initialMatch()
    this.initialListRef()
  }

  initialMatch = () => {
    this.match = {}
    for (const member of this.props.game?.members) {
      this.match[member] = 0
    }
  }
  initialListRef = () => {
    //max = 12
    this.listRef = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}].map(() => createRef())
  }

  // UNSAFE_componentWillReceiveProps(nextProps) {
  //   const currentGameMembers = this.props?.game?.members
  //   const newGameMembers = nextProps?.game?.members
  //   if (size(newGameMembers) !== size(currentGameMembers)) {
  //     this.initialListRef()
  //   }
  // }

  _componentDidMount() {
  }

  renderItem = ({ item, index }) => {
    return (
      <Item
        showHint={this.props.showHint}
        onCloseHint={() => {
          this.setStateSafe({ visibleHint1: true })
          this.props.onCloseHint()
        }}
        onChangeValue={(value) => {
          this.match[item] = !isNaN(Number(value)) ? Number(value) : 0
        }}
        getOtherValue={this.getOtherValue}
        ref={this.listRef[index]}
        item={item}
        index={index} />
    )
  }

  renderList = () => {
    return <View>
      <FlatList
        keyboardShouldPersistTaps={"handled"}
        bounces={false}
        data={this.props.game?.members}
        style={styles.list}
        keyExtractor={(item) => item}
        renderItem={this.renderItem}
      />
    </View>
  }

  addMatch = async () => {
    let zeroSum = 0;
    let hasEdited = false
    let isNan = false
    for (const key in this.match) {
      if (Object.hasOwnProperty.call(this.match, key)) {
        const memberScore = this.match[key];

        if (isNaN(memberScore)) {
          isNan = true
        }

        if (memberScore) {
          hasEdited = true
        }
        zeroSum += memberScore
      }
    }
    if (!hasEdited) {
      return
    }
    if (isNan) {
      return NavigationService.getInstance().showToast({ message: "Dữ liệu không hợp lệ" })
    }
    if (zeroSum !== 0) {
      return NavigationService.getInstance().showToast({ message: "Tổng chưa bằng 0" })
    }
    const newGame = cloneDeep(this.props.game)
    newGame.matches = [
      this.match,
      ...(newGame.matches || [])
    ]
    try {
      FireStoreModule.updateGame(newGame, newGame.id)
      for (const ref of this.listRef) {
        ref?.current?.clearData && ref.current.clearData()
      }
    } catch (e) {
      console.error("update game error:", e)
    }
  }

  getOtherValue = (item) => {
    let otherValue = 0;
    for (const key in this.match) {
      if (Object.hasOwnProperty.call(this.match, key)) {
        if (key === item) continue
        const memberScore = this.match[key];
        otherValue += memberScore
      }
    }
    return 0 - otherValue
  }

  renderFooter = () => {
    return (<View
      style={styles.footerContainer}>

      <View
        style={[styles.footerButtonContainer]}>
        <Tooltip
          visible={this.state.visibleHint1}
          onClose={() => {
            setTimeout(() => {
              this.setStateSafe({
                visibleHint1: false,
                visibleHint2: true
              })
            }, 500)
          }}
          content="Xác nhận cộng điểm"
        >
          <Pressable
            onPress={this.addMatch}
            hitSlop={16}>
            <SVGIcon.ticked width={32} height={32} />
          </Pressable>
        </Tooltip>

      </View>

      <View
        style={styles.footerButtonContainer}>
        <Tooltip
          visible={this.state.visibleHint2}
          onClose={() => {
            this.setStateSafe({
              visibleHint2: false
            })
          }}
          content="Xoá điểm"
        >
          <Pressable
            onPress={() => {
              for (const ref of this.listRef) {
                ref?.current?.clearData && ref.current.clearData()
              }
            }}
            hitSlop={16}>
            <SVGIcon.cancel width={32} height={32} />
          </Pressable>
        </Tooltip>
      </View>
    </View>)
  }

  renderContent() {
    return (
      <View style={styles.container}>
        <KeyboardScrollView
          keyboardVerticalOffset={IS_ANDROID ? 58 : 0}
          style={{
            flex: 1,
          }}>
          <View>
            <Image
              source={Images.assets.top_cover.source}
              style={styles.cover}
            />
          </View>
          <View
            style={styles.title}>
            <CustomText
              style={styles.subTitle}>
              nghiêm túc thực hiện{`\n`}
              nhiệm vụ người cầm súng
            </CustomText>
          </View>
          {this.renderList()}
        </KeyboardScrollView>
        {this.renderFooter()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  footerButtonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  footerContainer: {
    flexDirection: "row",
    backgroundColor: Colors.briggs,
    paddingVertical: 16,
    paddingBottom: 24
  },
  list: {
    flex: 1,
    paddingHorizontal: 12,
  },
  subTitle: {
    color: Colors.white,
    textAlign: "center",
    lineHeight: 21
  },
  title: {
    alignItems: 'center',
    paddingVertical: 16
  },
  cover: {
    resizeMode: "contain",
    width: widthDevice,
    height: widthDevice * 0.5625,
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: Colors.backgroundScreen
  },
});

export default FightScreen
