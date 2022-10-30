import * as React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from '..';
import { Colors } from '../../../themes/Colors';
import { TAB_HEIGHT } from '../../../utils/DeviceUtil';
import BaseCommon from '../BaseCommon';

class TabBar extends BaseCommon {
  constructor(props) {
    super(props);
    this.displayName = 'TabBar';
    this.state = {
      currentIndex: 0,
    };
  }
  onPressTab = (it, index) => {
    const { onPressTab } = this.props;
    this.setStateSafe({ currentIndex: index });
    onPressTab && onPressTab(it, index);
  }

  renderUnderLineTab = (index) => {
    const { currentIndex } = this.state;
    if (index === currentIndex) {
      return <View style={styles.underLineTab} />;
    }
    return null;
  };


  renderContent() {
    const { data } = this.props;
    console.log('dataTabbar', data);
    return (
      <View style={styles.wrapListFilter} >
        {
          data ? data.map((it, index) => {
            return (
              <Pressable
                onPress={() => this.onPressTab(it, index)}
                style={styles.tabFilter}
              >
                <View
                  style={{
                    borderRightColor: Colors.inActiveUnderlineInput,
                    borderRightWidth: index === data.length - 1 ? 0 : 1,
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                  }}
                >
                  <Text size={12}>{it.title}</Text>
                </View>
                {this.renderUnderLineTab(index)}
              </Pressable>
            );
          }) : null
        }
      </View>
    );
  }
}

export default TabBar;

const styles = StyleSheet.create({
  wrapListFilter: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    shadowColor: Colors.shadowColor,
    height: TAB_HEIGHT,
    width: '100%',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 20,
    shadowOpacity: 1,
    elevation: 5,
  },
  tabFilter: { flex: 1, alignItems: 'center' },
  underLineTab: { width: '100%', height: 2 },
});
