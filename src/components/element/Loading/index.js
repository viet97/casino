import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import PropTypes from 'prop-types';

import BaseElement from '../BaseElement';
import { EmitterManager } from '../../../modules/EmitterManager';
import LoadingManager from './LoadingManager';
import { insets } from '../../../utils/DeviceUtil';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../themes/Colors';
import { Images } from '../../../themes/Images';

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
          <Image
            style={{
              width: 150,
              height: 150
            }}
            source={Images.assets.loading.source} />
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
