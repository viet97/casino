import React, { createRef } from 'react';
import { FlatList, Image, Pressable, StyleSheet, View } from 'react-native';

import BaseScreen from '../BaseScreen';
import NavigationService from '../../../navigation/NavigationService';
import { Images } from '../../../themes/Images';
import { widthDevice } from '../../../utils/DeviceUtil';
import { Colors } from '../../../themes/Colors';
import CustomText from '../../common/Text';
import SVGIcon from '../../../../assets/SVGIcon';
import Item from './Item';
import KeyboardScrollView from '../../element/KeyboardScrollView';
import BaseElement from '../../element/BaseElement';
import { cloneDeep, filter, isNumber } from 'lodash';
import FireStoreModule from '../../../modules/FireStoreModule';

class SplashScreen extends BaseElement {
  constructor(props) {
    super(props);
    this.state = {};
    this.displayName = 'SplashScreen';
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
    this.listRef = this.props.game?.members.map(() => createRef())
  }

  _componentDidMount() {
  }

  renderItem = ({ item, index }) => {
    return (
      <Item
        onChangeValue={(value) => {
          this.match[item] = !isNaN(Number(value)) ? Number(value) : 0
          console.log("this.match", this.match)
        }}
        getOtherValue={this.getOtherValue}
        ref={this.listRef[index]}
        item={item}
        index={index} />
    )
  }

  renderList = () => {
    return <KeyboardScrollView
      style={{
        flex: 1,
      }}>
      <FlatList
        keyboardShouldPersistTaps={"handled"}
        bounces={false}
        data={this.props.game?.members}
        style={styles.list}
        keyExtractor={(item) => item}
        renderItem={this.renderItem}
      />
    </KeyboardScrollView>
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
      FireStoreModule.updateGame(newGame)
      for (const ref of this.listRef) {
        ref.current.clearData()
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
        style={styles.footerButtonContainer}>
        <Pressable
          onPress={this.addMatch}
          hitSlop={16}>
          <SVGIcon.ticked width={32} height={32} />
        </Pressable>
      </View>
      <View
        style={styles.footerButtonContainer}>
        <Pressable
          onPress={() => {
            for (const ref of this.listRef) {
              ref.current.clearData()
            }
          }}
          hitSlop={16}>
          <SVGIcon.cancel width={32} height={32} />
        </Pressable>
      </View>
    </View>)
  }

  renderContent() {
    return (
      <View style={styles.container}>
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

export default SplashScreen
