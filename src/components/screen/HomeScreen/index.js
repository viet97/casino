import React from 'react';
import { FlatList, Image, Pressable, StyleSheet, View } from 'react-native';

import BaseScreen from '../BaseScreen';
import { Colors } from '../../../themes/Colors';
import { Images } from '../../../themes/Images';
import { widthDevice } from '../../../utils/DeviceUtil';
import CustomText from '../../common/Text';
import SVGIcon from '../../../../assets/SVGIcon';
import LinearGradient from 'react-native-linear-gradient';
import NavigationService from '../../../navigation/NavigationService';
import { ROUTER_NAME } from '../../../navigation/NavigationConst';

const COVER_HEIGHT = widthDevice * 260 / 393

class HomeScreen extends BaseScreen {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.displayName = 'HomeScreen';
  }

  renderItem = ({ item, index }) => {
    return (
      <Pressable
        onPress={() => NavigationService.getInstance().navigate({ routerName: ROUTER_NAME.DETAIL.name })}
        style={{
          paddingTop: 6,
          paddingHorizontal: 20,
          paddingBottom: 16,
          borderWidth: 3,
          borderColor: Colors.skema,
          marginBottom: 16,
          overflow: "hidden",
        }}>
        <Image
          style={{
            ...StyleSheet.absoluteFillObject,
            position: "absolute",
            left: 0,
            right: 0,
            width: widthDevice - 48,
            height: 90,
            top: 0,
            backgroundColor: Colors.nero
          }}
          source={Images.assets.item_cover.source}
        />

        <CustomText
          numberOfLines={2}
          style={{
            letterSpacing: 0.05,
            color: Colors.white,
            lineHeight: 29.75
          }}>
          Bida Pod Foods
        </CustomText>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end'
          }}>
          <CustomText
            style={{
              color: Colors.white,
              lineHeight: 18,
              marginRight: 20,
              flex: 1
            }}
            size={11}>
            Gia, Trí, Việt, Khang, Tân, Thiêm, Thắng, Hiệp, Mạnh,123,123,12,312
          </CustomText>
          <Pressable
            hitSlop={16}>
            <SVGIcon.help width={24} height={24} />
          </Pressable>
        </View>
      </Pressable>
    )
  }

  renderList = () => {
    return (
      <FlatList
        data={[{}, {}, {}, {}, {}, {},]}
        renderItem={this.renderItem}
        contentContainerStyle={{
          paddingTop: COVER_HEIGHT - 32,
          paddingBottom: 100
        }}
        style={{
          paddingHorizontal: 24,
        }}
      />
    )
  }

  renderBottom = () => {
    return (
      <LinearGradient
        style={{
          flexDirection: "row",
          paddingVertical: 32,
          paddingHorizontal: 24,
          position: 'absolute',
          bottom: 0,
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowColor: Colors.black,
          shadowRadius: 20,
          shadowOpacity: 0.1,
          alignItems: 'center',
          elevation: 5,
        }}
        start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} colors={['#05131C', "rgba(5, 19, 28, 0)"]} >
        <Pressable>
          <SVGIcon.scanner
            width={56}
            height={56}
          />
        </Pressable>
        <Pressable
          style={{
            flex: 1,
            height: 52,
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 12,
            justifyContent: 'center',
            borderWidth: 3,
            borderColor: Colors.skema,
            backgroundColor: 'red'
          }}>
          <SVGIcon.crown />
          <CustomText
            style={{
              letterSpacing: 0.05,
              marginLeft: 12
            }}>
            Tạo trận mới
          </CustomText>
        </Pressable>
      </LinearGradient>
    )
  }

  renderContent() {
    return (
      <View style={styles.container}>
        <View
          style={{
            justifyContent: 'center',
            position: "absolute"
          }}>
          <Image
            source={Images.assets.top_cover.source}
            style={styles.cover}
          />
          <CustomText
            size={22}
            style={styles.title}>
            SỔ SINH TỬ
          </CustomText>
        </View>
        {this.renderList()}
        {this.renderBottom()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    color: Colors.white,
    position: 'absolute',
    alignSelf: 'center',
    marginTop: 12
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: Colors.nero
  },
  cover: {
    resizeMode: "contain",
    width: widthDevice,
    height: COVER_HEIGHT,
  },
});

export default HomeScreen
