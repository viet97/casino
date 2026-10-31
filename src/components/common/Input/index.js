import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import BaseCommon from '../BaseCommon';
import { Colors } from '../../../themes/Colors';
import { FONT_SCALE } from '../../../utils/DeviceUtil';

class Input extends BaseCommon {
  constructor(props) {
    super(props);
    this.state = {};
    this.displayName = 'Input';
  }
  renderContent() {
    const {
      style,
      ...otherProps
    } = this.props;
    const staticStyle = {};
    staticStyle.fontFamily = "FVF Fernando 08";
    if (FONT_SCALE !== 1) {
      const { fontSize = 14, lineHeight, height } = StyleSheet.flatten(style) || {};
      staticStyle.fontSize = fontSize * FONT_SCALE;
      if (typeof lineHeight === 'number') {
        staticStyle.lineHeight = lineHeight * FONT_SCALE;
      }
      if (typeof height === 'number') {
        staticStyle.height = height * FONT_SCALE;
      }
    }
    return (
      <TextInput
        style={[
          styles.defaultText,
          style,
          staticStyle,
        ]}
        allowFontScaling={false}
        {...otherProps}
      />
    );
  }
}

Input.defaultProps = {
  size: 14,
};

const styles = StyleSheet.create({
  defaultText: {
    color: Colors.white,
  },
});

export default Input;
