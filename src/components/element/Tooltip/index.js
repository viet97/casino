import React from 'react';
import BaseElement from '../BaseElement';
import TooltipComp from 'react-native-walkthrough-tooltip';
import { Text } from '../../common';
import { Colors } from '../../../themes/Colors';

export default class Tooltip extends BaseElement {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  _componentDidMount() {
    if (this.props.visible) {
      setTimeout(() => {
        this.setStateSafe({ visible: true })
      }, 500);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.visible !== this.props.visible) {
      this.setStateSafe({ visible: nextProps.visible })
    }
  }

  renderContent() {
    const { childrenWrapperStyle, children, content, onClose } = this.props;
    return (
      <TooltipComp
        isVisible={this.state.visible}
        content={<Text
          size={12}>{content}</Text>}
        placement="top"
        onClose={() => {
          this.setState({ visible: false })
          onClose && onClose()
        }}

        contentStyle={{
          backgroundColor: "#05131C",
          borderWidth: 3,
          borderColor: Colors.skema,
        }}
        arrowStyle={{
          borderTopColor: Colors.skema,
          overflow: "hidden",
          zIndex: 999
        }}
        childrenWrapperStyle={childrenWrapperStyle}
      >
        {children}
      </TooltipComp>
    )
  }
}
