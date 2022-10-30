import React from 'react';
import BaseElement from '../BaseElement';
import {
  findNodeHandle,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  UIManager,
} from 'react-native';
import { IS_ANDROID } from '../../../utils/DeviceUtil';

export default class KeyboardScrollView extends BaseElement {
  constructor(props) {
    super(props);
    this.state = {
      keyboardHeight: null,
    };
    this.scrollView = React.createRef();
    this.y = 0;
    this.x = 0;
    this.scrollHeight = 0;
  }
  _componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._updateKeyboardSpace
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHide
    );
  }

  getScrollResponder = () => {
    return (
      this.scrollView &&
      this.scrollView.current &&
      this.scrollView.current.getScrollResponder &&
      this.scrollView.current.getScrollResponder()
    );
  };
  _updateKeyboardSpace = (frames) => {
    // Automatically scroll to focused TextInput
    let keyboardHeight = frames.endCoordinates.height;
    this.setState({ keyboardHeight });
    const currentlyFocusedField = TextInput.State.currentlyFocusedInput
      ? findNodeHandle(TextInput.State.currentlyFocusedInput())
      : TextInput.State.currentlyFocusedField();
    const responder = this.getScrollResponder();
    if (!currentlyFocusedField || !responder) {
      return;
    }
    UIManager.viewIsDescendantOf(
      currentlyFocusedField,
      responder.getInnerViewNode(),
      (isAncestor) => {
        if (isAncestor) {
          UIManager.measureInWindow(
            currentlyFocusedField,
            (inputX, inputY, inputWidth, inputHeight) => {
              if (!IS_ANDROID) {
                if (inputY + inputHeight >= this.scrollHeight) {
                  this.scrollTo(
                    this.y + (inputY - this.scrollHeight + inputHeight)
                  );
                }
              } else {
                //android
              }
            }
          );
        }
      }
    );
  };

  scrollTo(y) {
    this.scrollView &&
      this.scrollView.current &&
      this.scrollView.current.scrollTo({ x: this.x, y, animated: true });
  }

  scrollToEnd() {
    this.scrollView &&
      this.scrollView.current &&
      this.scrollView.current.scrollToEnd()
  }

  keyboardDidHide = (frame) => {
  };

  onScroll = (e) => {
    const { onScroll } = this.props;
    onScroll && onScroll(e);
    this.y = e?.nativeEvent?.contentOffset?.y;
    this.x = e?.nativeEvent?.contentOffset?.x;
  };

  componentWillUnmount() {
    this.keyboardDidHideListener && this.keyboardDidHideListener.remove();
    this.keyboardDidHideListener && this.keyboardDidHideListener.remove();
  }

  renderContent() {
    const { style, contentContainerStyle, children, noAvoidingView } = this.props;
    if (noAvoidingView) {
      return <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}
        bounces={false}
        {...this.props}
        ref={this.scrollView}
        style={[{ flex: 1 }, style]}
        contentContainerStyle={contentContainerStyle}
        onScroll={this.onScroll}
        scrollEventThrottle={16}
        onLayout={(e) => {
          if (
            !this.scrollHeight ||
            this.scrollHeight > e.nativeEvent.layout.height
          ) {
            this.scrollHeight = e.nativeEvent.layout.height;
          }
        }}
      >
        {children}
      </ScrollView>;
    }
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={IS_ANDROID ? 'height' : 'padding'}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'handled'}
          bounces={false}
          {...this.props}
          ref={this.scrollView}
          style={[{ flex: 1 }, style]}
          contentContainerStyle={contentContainerStyle}
          onScroll={this.onScroll}
          scrollEventThrottle={16}
          onLayout={(e) => {
            if (
              !this.scrollHeight ||
              this.scrollHeight > e.nativeEvent.layout.height
            ) {
              this.scrollHeight = e.nativeEvent.layout.height;
            }
          }}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
