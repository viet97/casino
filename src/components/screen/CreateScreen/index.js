import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Images } from '../../../themes/Images';
import { widthDevice } from '../../../utils/DeviceUtil';
import { Colors } from '../../../themes/Colors';
import SVGIcon from '../../../../assets/SVGIcon';
import BaseScreen from '../BaseScreen';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../../common/Text';
import Input from '../../common/Input';
import moment from 'moment';
import { size, trim, uniq } from 'lodash';
import TagInput from 'react-native-tags-input';
import 'react-native-get-random-values';

import { v4 as uuidv4 } from 'uuid';
import NavigationService from '../../../navigation/NavigationService';
import { ROUTER_NAME } from '../../../navigation/NavigationConst';
import FireStoreModule from '../../../modules/FireStoreModule';
import LoadingManager from '../../element/Loading/LoadingManager';
import LocalStorage from '../../../modules/LocalStorage';
import KeyboardScrollView from '../../element/KeyboardScrollView';

class CreateScreen extends BaseScreen {
  constructor(props) {
    super(props);
    this.state = {
      isFocusNameInput: false,
      isFocusTagInput: false,
      name: moment().format("DD/MM/YYYY HH:mm"),
      tags: {
        tag: '',
        tagsArray: [],
        listName: []
      },
    };
    this.displayName = 'CreateScreen';
    this.listGame = props.route?.params?.listGame || []
    this.maxTag = 12
  }

  _componentDidMount() {
    LocalStorage.getItem(LocalStorage.DEFINE_KEY.LIST_NAME).then(listName => {
      this.setStateSafe({ listName: JSON.parse(listName) || [] })
    })
  }

  isValidate = () => {
    const { name, tags } = this.state
    if (size(tags?.tagsArray) >= 2 && trim(name)) return true
    return false
  }

  createGame = async () => {
    const { name, tags } = this.state
    try {
      const id = uuidv4()
      LoadingManager.getInstance().visibleLoading(true)
      await FireStoreModule.addGame({
        name,
        id,
        members: tags.tagsArray,
        matches: []
      }, id)
      let newListName = uniq([...tags.tagsArray, ...(this.state.listName || [])])
      if (size(newListName) > 50) {
        newListName = newListName.slice(0, 50)
      }
      LocalStorage.setItem(LocalStorage.DEFINE_KEY.LIST_NAME, newListName)
      NavigationService.getInstance().goBack()

      setTimeout(() => {
        NavigationService.getInstance().navigate({
          routerName: ROUTER_NAME.DETAIL.name, params: {
            game: {
              name,
              id,
              members: tags.tagsArray,
              matches: [],
              uid: FireStoreModule.uid
            }
          }
        })
      })

    } catch (e) {
      alert(e)
      console.error("create game error:", e)
    }
    LoadingManager.getInstance().visibleLoading(false)
  }

  renderBottom = () => {
    return (
      <LinearGradient
        style={styles.bottom}
        start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} colors={['#05131C', "rgba(5, 19, 28, 0)"]} >
        <Pressable
          disabled={!this.isValidate()}
          onPress={this.createGame}
          style={styles.createGameButton}>
          <Image
            style={[styles.scannerIcon, {
              opacity: this.isValidate() ? 0.6 : 0.3
            }]}
            source={Images.assets.start_game_cover.source}
          />
          <SVGIcon.start_game />
          <CustomText
            style={styles.createGame}>
            Bắt đầu sát phạt
          </CustomText>
        </Pressable>
      </LinearGradient>
    )
  }

  renderNameInput = () => {
    const { isFocusNameInput, name } = this.state
    return (<View
      key={"inputName"}
      style={[styles.nameInput, {
        borderColor: isFocusNameInput ? Colors.skema : "#4B52A9",
      }]}>
      <CustomText
        size={11}
        style={{
          color: isFocusNameInput ? Colors.skema : Colors.white
        }}>
        Đặt tên cho trận
      </CustomText>
      <Input
        style={styles.inputName}
        value={name}
        onChangeText={name => this.setStateSafe({ name })}
        onBlur={() => this.setStateSafe({ isFocusNameInput: false })}
        onFocus={() => this.setStateSafe({ isFocusNameInput: true })}
      />
    </View>)
  }

  renderSuggestion = () => {
    if (!size(this.state.listName)) return null
    return (<View
      style={styles.suggestionContainer}>
      <CustomText
        size={11}>
        Thêm nhanh người chơi
      </CustomText>
      <View
        style={styles.suggestionContentContainer}>
        {this.state.listName.map(item => {
          return (<Pressable
            onPress={() => {
              this.setStateSafe({
                tags: {
                  ...this.state.tags,
                  tagsArray: uniq([...(this.state.tags?.tagsArray || []), item])
                }
              })
            }}
            style={styles.suggestionTag}>
            <CustomText
              numberOfLines={1}
              style={styles.tagName}
              size={13}>
              {item}
            </CustomText>
          </Pressable>)
        })}
      </View>
    </View>)
  }

  updateTagState = (state) => {
    if (size(state.tagsArray) > this.maxTag) {
      return NavigationService.getInstance().showToast({ message: "Số lượng người chơi tối đa là 12" })
    }
    this.setState({
      tags: state
    })
  };

  renderTagInput = () => {
    const { isFocusTagInput } = this.state

    return (
      <View
        style={[styles.tagInputContainer, {
          borderColor: isFocusTagInput ? Colors.skema : "#4B52A9",
        }]}>
        <CustomText
          size={11}
          style={{
            color: isFocusTagInput ? Colors.skema : Colors.white
          }}>
          Điền tên người chơi (cách nhau bằng dấu phẩy)
        </CustomText>
        <TagInput
          placeholder={"VD: An, Bình, Chi, Dương"}
          inputStyle={styles.tagInput}
          leftElement={<View />}
          leftElementContainerStyle={{ marginLeft: 0 }}
          containerStyle={{ width: "100%" }}
          autoCorrect={false}
          keysForTag={","}
          updateState={this.updateTagState}
          tags={this.state.tags}
          onBlur={() => this.setStateSafe({ isFocusTagInput: false })}
          onFocus={() => this.setStateSafe({ isFocusTagInput: true })}
          renderTag={({
            item,
            count,
            deleteTag
          }) => {
            return (
              <View
                style={[styles.suggestionTag, {
                  flexDirection: 'row',
                  alignItems: 'center',
                }]}>
                <CustomText
                  numberOfLines={1}
                  style={styles.tagName}
                  size={13}>
                  {item}
                </CustomText>
                <Pressable
                  onPress={deleteTag}
                  hitSlop={8}
                  style={{
                    marginLeft: 6,
                  }}>
                  <SVGIcon.deleteIcon width={12} height={12} />
                </Pressable>
              </View>
            )
          }}
        />
      </View>

    )
  }

  renderContent() {
    return (
      <View style={styles.container}>
        <View
          style={styles.topCoverContainer}>
          <Image
            source={Images.assets.create_cover.source}
            style={styles.cover}
          />
          <CustomText
            size={22}
            style={styles.title}>
            TẠO TRẬN MỚI
          </CustomText>
        </View>
        <KeyboardScrollView
          contentContainerStyle={styles.scrollViewContentContainer}
          keyboardShouldPersistTaps="handled"
          style={{
            flex: 1,
            marginTop: -32
          }}>
          {this.renderNameInput()}
          {this.renderTagInput()}
          {this.renderSuggestion()}
        </KeyboardScrollView>

        {this.renderBottom()}
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
  scrollViewContentContainer: {
    paddingBottom: 100
  },
  inputName: {
    marginTop: 2,
    height: 30,
    letterSpacing: 0.05,
  },
  tagInput: {
    marginTop: 2,
    height: 30,
    letterSpacing: 0.05,
    color: Colors.white,
    width: '100%',
    fontSize: 14,
    fontFamily: "FVF Fernando 08",
  },
  tagInputContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
    marginTop: 24,
    backgroundColor: Colors.backgroundScreen,
    marginHorizontal: 24,
    borderWidth: 2,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: Colors.black,
    shadowRadius: 20,
    shadowOpacity: 0.5,
    elevation: 5,
  },
  tagName: {
    maxWidth: widthDevice / 3
  },
  suggestionTag: {
    marginRight: 8,
    height: 30,
    paddingHorizontal: 12,
    backgroundColor: Colors.toyota,
    justifyContent: 'center',
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#2A90FF"
  },
  suggestionContentContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: 'wrap'
  },
  suggestionContainer: {
    flex: 1,
    marginTop: 16,
    marginHorizontal: 24,
  },
  nameInput: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
    backgroundColor: Colors.backgroundScreen,
    marginHorizontal: 24,
    borderWidth: 2,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: Colors.black,
    shadowRadius: 20,
    shadowOpacity: 0.5,
    elevation: 5,
  },
  cover: {
    resizeMode: "stretch",
    width: widthDevice,
    height: widthDevice * 260 / 393,
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: Colors.blackRussian
  },
  back: {
    position: "absolute",
    top: 52,
    left: 16
  },
  createGameButton: {
    flex: 1,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
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
      height: 4,
    },
    shadowColor: Colors.black,
    shadowRadius: 20,
    shadowOpacity: 0.1,
    elevation: 5,
  },
  scannerIcon: {
    position: 'absolute',
    resizeMode: "cover"
  },
  createGame: {
    letterSpacing: 0.05,
    marginLeft: 12
  },
  title: {
    color: Colors.white,
    position: 'absolute',
    alignSelf: 'center',
    marginTop: 12
  },
  topCoverContainer: {
    justifyContent: 'center',
  },
});

export default CreateScreen
