import React from 'react';
import { ViewPropTypes, StyleSheet, View, Animated, Text, Pressable } from 'react-native';
import PropTypes from 'prop-types';
import BaseCommon from '../BaseCommon';

class DefaultTabBar extends BaseCommon {
  constructor(props) {
    super(props);
    this.displayName = 'DefaultTabBar';
  }

  renderTab = (name, page, isTabActive, onPressHandler) => {
    const {
      activeTextColor,
      inactiveTextColor,
      textStyle,
      customStyleTabBarText,
      tabStyle,
    } = this.props;
    const textColor = isTabActive ? activeTextColor : inactiveTextColor;
    const fontWeight = isTabActive ? 'bold' : 'normal';
    const styleContent = { flex: 1 };
    return (
      <Pressable
        style={[
          styleContent,
          {
            // backgroundColor: isTabActive ? 'red' : 'yellow',
          },
        ]}
        key={name}
        accessible={true}
        accessibilityLabel={name}
        onPress={() => onPressHandler(page)}>
        <View style={[styles.tab, tabStyle]}>
          <Text
            style={[
              { color: textColor, fontWeight },
              textStyle,
              customStyleTabBarText ? customStyleTabBarText({ page }) : {},
            ]}>
            {name}
          </Text>
        </View>
      </Pressable>
    );
  };

  renderContent() {
    const { tabs, customOutputRangeTabBar } = this.props;
    const containerWidth = this.props.containerWidth;
    const numberOfTabs = this.props.tabs.length;
    const tabUnderlineStyle = {
      position: 'absolute',
      width: containerWidth / numberOfTabs,
      height: 44,
      backgroundColor: 'navy',
      bottom: 0,
      borderRadius: 5,
    };

    const translateX = this.props.scrollValue.interpolate({
      inputRange: [0, 1],
      outputRange: customOutputRangeTabBar
        ? customOutputRangeTabBar({ containerWidth, numberOfTabs })
        : [0, containerWidth / numberOfTabs],
    });
    return (
      <View
        style={[
          styles.tabs,
          { backgroundColor: this.props.backgroundColor },
          this.props.style,
        ]}>
        {tabs.map((name, page) => {
          const isTabActive = this.props.activeTab === page;
          const renderTab = this.props.renderTab || this.renderTab;
          return renderTab(name, page, isTabActive, this.props.goToPage);
        })}
        <Animated.View
          style={[
            tabUnderlineStyle,
            {
              transform: [{ translateX }],
            },
            this.props.underlineStyle,
          ]}
        />
      </View>
    );
  }
}

DefaultTabBar.propTypes = {
  goToPage: PropTypes.func,
  activeTab: PropTypes.number,
  tabs: PropTypes.array,
  backgroundColor: PropTypes.string,
  activeTextColor: PropTypes.string,
  inactiveTextColor: PropTypes.string,
  textStyle: Text.propTypes.style,
  tabStyle: ViewPropTypes.style,
  renderTab: PropTypes.func,
  underlineStyle: ViewPropTypes.style,
};

DefaultTabBar.defaultProps = {
  activeTextColor: 'navy',
  inactiveTextColor: 'black',
  backgroundColor: null,
};

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 4,
  },
  tabs: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#ccc',
  },
});

export default DefaultTabBar;
