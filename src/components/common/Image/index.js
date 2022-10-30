import * as React from 'react';
import { Platform, Image, ImageBackground, View, Pressable } from 'react-native';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';

import BaseCommon from '../BaseCommon';
import { isArray } from 'lodash';
import { Images } from '../../../themes/Images';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Colors } from '../../../themes/Colors';
import { statusBarHeight, IS_ANDROID } from '../../../utils/DeviceUtil';
import { Text } from '..';

export const TYPE_LEVEL_IMAGE = {
  LOW: FastImage.priority.low,
  NORMAL: FastImage.priority.normal,
  HIGH: FastImage.priority.high,
};

export const TYPE_IMAGE_RESIZE_MODE = {
  CENTER: 'center',
  CONTAIN: 'contain',
  COVER: 'cover',
  REPEAT: 'repeat',
  STRETCH: 'stretch',
};

export const TYPE_IMAGE = {
  HORIZONTAL: 1,
  VERTICAL: 2,
};

const getResizeMode = (name) => {
  switch (name) {
    case TYPE_IMAGE_RESIZE_MODE.COVER:
      return FastImage.resizeMode.cover;
    case TYPE_IMAGE_RESIZE_MODE.STRETCH:
      return FastImage.resizeMode.stretch;
    case TYPE_IMAGE_RESIZE_MODE.CONTAIN:
      return FastImage.resizeMode.contain;
    case TYPE_IMAGE_RESIZE_MODE.CENTER:
      return FastImage.resizeMode.center;
    default:
      return FastImage.resizeMode.cover;
  }
};

const STATE_IMAGE = {
  START_LOAD: 1,
  LOAD_SUCCESS: 2,
  LOAD_ERROR: 3,
};

class CustomImage extends BaseCommon {
  constructor(props) {
    super(props);
    this.displayName = 'CustomImage';
    this.state = {
      stateImage: STATE_IMAGE.START_LOAD,
      isPreviewing: false,
    };
  }

  static ResizeMode = TYPE_IMAGE_RESIZE_MODE;

  renderPreviewImage = () => {
    const { usePreview, previewSource, index } = this.props;
    const { isPreviewing } = this.state;
    if (!usePreview || !previewSource) { return null; }
    let imageUrls = [];
    if (isArray(previewSource)) {
      imageUrls = previewSource.map(it => ({ url: it }));
    } else {
      imageUrls = [{ url: previewSource }];
    }

    return (
      <Modal
        useNativeDriver={IS_ANDROID}
        style={{
          flex: 1,
          margin: 0,
        }}
        onBackdropPress={() => this.setStateSafe({ isPreviewing: false })}
        onBackButtonPress={() => this.setStateSafe({ isPreviewing: false })}
        visible={isPreviewing}
        transparent={true}
        backdropOpacity={0.5}
      >
        <ImageViewer
          saveToLocalByLongPress={false}
          useNativeDriver
          enablePreload
          onCancel={() => this.setStateSafe({ isPreviewing: false })}
          renderIndicator={(currentIndex, allSize) => {
            if (allSize === 1) { return null; }
            return (
              <Text
                style={{
                  top: statusBarHeight + 16,
                  alignSelf: 'center',
                  color: Colors.white,
                  position: 'absolute',
                }}>{currentIndex} / {allSize}</Text>
            );
          }}
          imageUrls={imageUrls}
          backgroundColor={Colors.background_droppicker}
          index={index}
          renderHeader={() => (
            <Pressable
              style={{
                position: 'absolute',
                zIndex: 999,
                top: statusBarHeight,
                right: 0,
                padding: 16,
              }}
              onPress={() => this.setStateSafe({ isPreviewing: false })}
            >
              <Image
                source={Images.assets.close.source}
                style={{ width: 36, height: 36 }}
              />
            </Pressable>
          )}
          enableSwipeDown
        />
      </Modal>
    );
  };

  renderContent() {
    const {
      style,
      source,
      children,
      useFastImage,
      level,
      placeholder,
      placeholderColor,
      placeholderElement,
      resizeMode,
      useBackground,
      useChildren,
      type,
      usePreview,
      ...otherProps
    } = this.props;
    let sourceDefault = '';
    let Wrapper = usePreview ? Pressable : View;
    if (!useFastImage || !source.uri || source.uri.indexOf('http') === -1) {
      if (useBackground) {
        return (
          <Wrapper
            useRipple={false}
            onPress={() => this.setStateSafe({ isPreviewing: true })}>
            <ImageBackground
              fadeDuration={0}
              style={[style]}
              source={source || sourceDefault}
              resizeMode={resizeMode}
              {...otherProps}
            >
              {children}
              {this.renderPreviewImage()}
            </ImageBackground>
          </Wrapper>
        );
      }
      return (
        <Wrapper
          onPress={() => this.setStateSafe({ isPreviewing: true })}>
          <Image
            fadeDuration={0}
            style={[style, { resizeMode }]}
            source={source || sourceDefault}
            // resizeMode={resizeMode}
            {...otherProps}
          >
            {children}
          </Image>
          {this.renderPreviewImage()}
        </Wrapper>

      );
    }

    const sourceFast = source
      ? {
        ...source,
        priority: level,
      }
      : {
        ...sourceDefault,
        priority: level,
      };
    const { stateImage } = this.state;

    const styleDefault = {
      backgroundColor: '#00000069',
      flex: 1,
    };

    if (stateImage === STATE_IMAGE.LOAD_ERROR) {
      return <View style={style} />;
    }
    return (
      <Wrapper onPress={() => this.setStateSafe({ isPreviewing: true })}>
        {stateImage === STATE_IMAGE.START_LOAD ||
          stateImage === STATE_IMAGE.LOAD_ERROR ? (
          <View style={[style, styleDefault]} />
        ) : null}
        <FastImage
          onLoadStart={() =>
            this.setStateSafe({ stateImage: STATE_IMAGE.START_LOAD })
          }
          onLoad={() => {
            this.setStateSafe({ stateImage: STATE_IMAGE.LOAD_SUCCESS });
          }}
          onError={() =>
            this.setStateSafe({ stateImage: STATE_IMAGE.LOAD_ERROR })
          }
          fadeDuration={0}
          fallback={Platform.OS === 'android'}
          style={stateImage === STATE_IMAGE.LOAD_SUCCESS ? style : null}
          source={sourceFast}
          {...otherProps}
          resizeMode={getResizeMode(resizeMode)}
        >
          {children}
        </FastImage>
        {this.renderPreviewImage()}
      </Wrapper>
    );
  }
}

CustomImage.defaultProps = {
  useFastImage: true,
  previewSource: '',
  usePreview: false,
  level: TYPE_LEVEL_IMAGE.NORMAL,
  resizeMode: TYPE_IMAGE_RESIZE_MODE.CONTAIN,
  source: Images.assets.default.source,
  type: TYPE_IMAGE.VERTICAL,
};

export default CustomImage;
export const VERTICAL_IMAGE_RATIO = 320 / 448;
export const HORIZONTAL_IMAGE_RATIO = 1125 / 635;
