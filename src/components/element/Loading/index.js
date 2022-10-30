import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import BaseElement from '../BaseElement';
import { EmitterManager } from '../../../modules/EmitterManager';
import LoadingManager from './LoadingManager';
import { insets } from '../../../utils/DeviceUtil';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIndicator } from 'react-native-indicators';
import { Colors } from '../../../themes/Colors';

class Loading extends BaseElement {
  constructor(props) {
    super(props);
    this.displayName = 'Loading';
    this.state = {
      loading: false,
    };
    LoadingManager.getInstance().isVisible = false;
  }

  _componentDidMount() {
    EmitterManager.getInstance().on(
      EmitterManager.listEvent.LOADING_GLOBAL_ON_OFF,
      this._visible,
    );
  }

  _componentWillUnmount() {
    EmitterManager.getInstance().off(
      EmitterManager.listEvent.LOADING_GLOBAL_ON_OFF,
      this._visible,
    );
  }

  _visible = (loading = true) => {
    LoadingManager.getInstance().isVisible = loading;
    this.setStateSafe({ loading });
  };

  renderContent() {
    const { loading } = this.state;
    const isShow = loading || this.props.loading;
    let containerStyle = {
      ...StyleSheet.absoluteFill,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.backgroundLoading,
      bottom: -insets.bottom,
    };

    if (isShow) {
      return (
        <SafeAreaView
          style={containerStyle}>
          <View
            style={{
              flexDirection: 'row',
              padding: 40,
              aspectRatio: 1,
              backgroundColor: Colors.white,
              borderRadius: 10
            }}>
            <MaterialIndicator color={Colors.mainColor} size={40} />
          </View>
        </SafeAreaView>
      );
    }
    return null;
  }
}

Loading.propTypes = {
  isLoadingVideo: PropTypes.bool,
  loading: PropTypes.bool,
};

Loading.defaultProps = {
  isLoadingVideo: false,
  loading: false,
};

export default Loading;
