import React from 'react';
import { View } from 'react-native';
import { MaterialIndicator } from 'react-native-indicators';
import { EmitterManager } from '../../../modules/EmitterManager';
import { Colors } from '../../../themes/Colors';
import { Text } from '../../common';

export default class LoadingManager {
  static getInstance() {
    if (!this._instance) {
      this._instance = new LoadingManager();
    }
    return this._instance;
  }

  static clear() {
    if (this._instance) {
      this._instance.destroy();
      delete this._instance;
    }
  }

  constructor() {
    this.displayName = 'LoadingManager';
    this._isVisible = false;
  }

  set isVisible(isVisible) {
    this._isVisible = isVisible;
  }

  get isVisible() {
    return this._isVisible;
  }

  renderInnerLoading = () => {
    return (
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <View style={{ flexDirection: 'row' }}>
          <MaterialIndicator color={Colors.mainColor} size={40} />
        </View>
        <Text style={{ color: Colors.bottom_title, marginTop: 8 }}>
          Loading.
        </Text>
        <Text style={{ color: Colors.bottom_title }}>
          Please wait...
        </Text>
      </View>
    );
  }

  visibleLoading(isVisible = true) {
    requestAnimationFrame(() =>
      EmitterManager.getInstance().emit(
        EmitterManager.listEvent.LOADING_GLOBAL_ON_OFF,
        isVisible,
      ),
    );
  }

  destroy() {
    this._isVisible = false;
  }
}
