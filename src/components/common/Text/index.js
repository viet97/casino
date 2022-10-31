import React from 'react';
import { Text, StyleSheet } from 'react-native';
import BaseCommon from '../BaseCommon';
import { Colors } from '../../../themes/Colors';

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
    staticStyle.fontSize = size;
    staticStyle.fontFamily = fontFamily;
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
