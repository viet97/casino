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
import FireStoreModule from '../../../modules/FireStoreModule';
import { trim } from 'lodash';

const COVER_HEIGHT = widthDevice * 260 / 393

class HomeScreen extends BaseScreen {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.displayName = 'HomeScreen';
  }

  renderItem = ({ item, index }) => {
    const { members, name } = item
    const membersNameString = members.map(name => trim(name)).join(", ")
    return (
      <Pressable
        onPress={() => NavigationService.getInstance().navigate({
          routerName: ROUTER_NAME.DETAIL.name,
          params: {
            game: item
          }
        })}
        style={styles.item}>
        <View
          style={styles.itemContentContainer}>
          <Image
            style={styles.itemBg}
            source={Images.assets.item_cover.source}
          />

          <CustomText
            numberOfLines={1}
            style={styles.itemName}>
            {trim(name)}
          </CustomText>
          <View
            style={styles.itemBottomRow}>
            <CustomText
              numberOfLines={2}
              style={styles.itemMembers}
              size={11}>
              {membersNameString}
            </CustomText>
            <Pressable
              hitSlop={16}>
              <SVGIcon.help width={24} height={24} />
            </Pressable>
          </View>
        </View>
      </Pressable>
    )
  }

  renderList = () => {
    return (
      <FlatList
        data={this.state.listGame}
        renderItem={this.renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContentContainer}
        style={styles.list}
      />
    )
  }

  renderBottom = () => {
    return (
      <LinearGradient
        style={styles.bottom}
        start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} colors={['#05131C', "rgba(5, 19, 28, 0)"]} >
        <Pressable>
          <SVGIcon.scanner
            width={56}
            height={56}
          />
        </Pressable>
        <Pressable
          onPress={() => NavigationService.getInstance().navigate({
            routerName: ROUTER_NAME.CREATE_GAME.name,
            params: {
              listGame: this.state.listGame
            }
          })}
          style={styles.createGameButton}>
          <Image
            style={styles.scannerIcon}
            source={Images.assets.create_game_bg.source}
          />
          <SVGIcon.crown />
          <CustomText
            style={styles.createGame}>
            Tạo trận mới
          </CustomText>
        </Pressable>
      </LinearGradient>
    )
  }

  async _componentDidMount() {
    this.gamesListener = await FireStoreModule.listenGamesChange(listGame => {
      this.setStateSafe({ listGame })
    })
  }

  _componentUnMount() {
    this.gamesListener && this.gamesListener()
  }

  renderContent() {
    return (
      <View style={styles.container}>
        <View
          style={styles.topCoverContainer}>
          <Image
            source={Images.assets.home_cover.source}
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
  itemContentContainer: {
    flex: 1,
    paddingTop: 6,
    paddingHorizontal: 20,
    paddingBottom: 16,
    overflow: 'hidden'
  },
  topCoverContainer: {
    justifyContent: 'center',
    position: "absolute"
  },
  createGame: {
    letterSpacing: 0.05,
    marginLeft: 12
  },
  scannerIcon: {
    position: 'absolute',
    resizeMode: "cover"
  },
  createGameButton: {
    flex: 1,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.skema,
    overflow: 'hidden'
  },
  bottom: {
    flexDirection: "row",
    paddingVertical: 32,
    paddingRight: 24,
    paddingLeft: 22,
    position: 'absolute',
    bottom: 0,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowColor: Colors.black,
    shadowRadius: 20,
    shadowOpacity: 0.1,
    elevation: 5,
  },
  list: {
    paddingHorizontal: 24,
  },
  listContentContainer: {
    paddingTop: COVER_HEIGHT - 32,
    paddingBottom: 100
  },
  itemMembers: {
    color: Colors.white,
    lineHeight: 18,
    marginRight: 20,
    flex: 1
  },
  itemBottomRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  itemName: {
    letterSpacing: 0.05,
    color: Colors.white,
    lineHeight: 29.75
  },
  itemBg: {
    ...StyleSheet.absoluteFillObject,
    position: "absolute",
    left: 0,
    right: 0,
    width: widthDevice - 48,
    height: 90,
    top: 0,
    backgroundColor: Colors.nero
  },
  item: {
    borderWidth: 3,
    borderColor: Colors.skema,
    marginBottom: 16,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: Colors.black,
    shadowRadius: 20,
    shadowOpacity: 0.5,
    elevation: 5,
  },
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
    backgroundColor: "#05131C"
  },
  cover: {
    resizeMode: "stretch",
    width: widthDevice,
    height: COVER_HEIGHT,
  },
});

export default HomeScreen
