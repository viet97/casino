import React from 'react';
import { Text, StyleSheet } from 'react-native';
import BaseCommon from '../BaseCommon';
import { Colors } from '../../../themes/Colors';
import { FONT_SCALE } from '../../../utils/DeviceUtil';

class CustomText extends BaseCommon {
  constructor(props) {
    super(props);
    this.state = {};
    this.displayName = 'CustomText';
  }
  renderContent() {
    const {
      size,
      style,
      color,
      children,
      numberOfLines,
      isLineThrough,
      ...otherProps
    } = this.props;
    const staticStyle = {};
    if (color) {
      staticStyle.color = color;
    }
    const fontFamily = "FVF Fernando 08";
    staticStyle.fontSize = size * FONT_SCALE;
    staticStyle.fontFamily = fontFamily;
    if (FONT_SCALE !== 1) {
      // Keep custom line heights in proportion so bigger text is not clipped
      const lineHeight = StyleSheet.flatten(style)?.lineHeight;
      if (lineHeight) {
        staticStyle.lineHeight = lineHeight * FONT_SCALE;
      }
    }
    return (
      <Text
        numberOfLines={numberOfLines}
        style={[
          styles.defaultText,
          style,
          staticStyle,
          isLineThrough
            ? {
              textDecorationLine: 'line-through',
              textDecorationStyle: 'solid',
            }
            : null,
        ]}
        allowFontScaling={false}
        {...otherProps}
      >
        {children}
      </Text>
    );
  }
}

CustomText.defaultProps = {
  size: 14,
};

const styles = StyleSheet.create({
  defaultText: {
    color: Colors.white,
  },
});

export default CustomText;
