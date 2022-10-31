import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import BaseCommon from '../BaseCommon';
import { Colors } from '../../../themes/Colors';

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
    // const fontFamily = bold ? 'Manrope-ExtraBold' : 'Manrope-Medium';
    // staticStyle.fontFamily = fontFamily;
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
