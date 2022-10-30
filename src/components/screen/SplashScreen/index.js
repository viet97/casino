import React from 'react';
import { FlatList, Image, Pressable, StyleSheet, TextInput, View } from 'react-native';

import BaseScreen from '../BaseScreen';
import NavigationService from '../../../navigation/NavigationService';
import { Images } from '../../../themes/Images';
import { widthDevice } from '../../../utils/DeviceUtil';
import { Colors } from '../../../themes/Colors';
import CustomText from '../../common/Text';
import SVGIcon from '../../../../assets/SVGIcon';
import Item from './Item';
import KeyboardScrollView from '../../element/KeyboardScrollView';

class SplashScreen extends BaseScreen {
  constructor(props) {
    super(props);
    this.state = {};
    this.displayName = 'SplashScreen';
    NavigationService.getInstance(props.navigation)
  }

  _componentDidMount() {
  }

  renderItem = ({ item, index }) => {
    return (
      <Item item={item} index={index} />
    )
  }

  renderList = () => {
    return <KeyboardScrollView
      style={{
        flex: 1,
      }}>
      <FlatList
        bounces={false}
        data={[{}, {}, {}, {}, {}, {}]}
        style={styles.list}
        renderItem={this.renderItem}
      />
    </KeyboardScrollView>
  }

  renderFooter = () => {
    return (<View
      style={styles.footerContainer}>
      <View
        style={styles.footerButtonContainer}>
        <Pressable
          hitSlop={16}>
          <SVGIcon.ticked width={32} height={32} />
        </Pressable>
      </View>
      <View
        style={styles.footerButtonContainer}>
        <Pressable
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
