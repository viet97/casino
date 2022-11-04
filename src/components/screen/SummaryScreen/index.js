import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Images } from '../../../themes/Images';
import { widthDevice } from '../../../utils/DeviceUtil';
import { Colors } from '../../../themes/Colors';
import BaseElement from '../../element/BaseElement';

class SummaryScreen extends BaseElement {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.displayName = 'SummaryScreen';
  }


  _componentDidMount() {
  }

  renderTop = () => {
    return <View
      style={{
        flexDirection: "row",
        width: widthDevice - 48,
        borderColor: "#7CF8FF",
        borderWidth: 2,
        alignSelf: "center"
      }}>
      {[{}, {}, {}].map(it => {
        return <View
          style={{
            flex: 1,
            paddingVertical: 8
          }}>

        </View>
      })}
    </View>
  }

  renderContent() {
    return (
      <View style={styles.container} >
        <View>
          <Image
            source={Images.assets.history_cover.source}
            style={styles.cover}
          />
        </View>
        {this.renderTop()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cover: {
    resizeMode: "contain",
    width: widthDevice,
    height: widthDevice * 0.5625,
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: Colors.backgroundScreen
  },
});

export default SummaryScreen
