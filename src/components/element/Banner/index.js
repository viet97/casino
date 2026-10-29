import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import BaseElement from '../BaseElement';
import AdsModule from '../../../modules/AdsModule';

export default class Banner extends BaseElement {
  constructor(props) {
    super(props);
    this.state = {
      isReady: AdsModule.isReady,
      isFailed: false,
    };
  }

  _componentDidMount() {
    this.removeReadyListener = AdsModule.onReady(() => this.setStateSafe({ isReady: true }))
  }

  _componentWillUnmount() {
    this.removeReadyListener && this.removeReadyListener()
  }

  renderContent() {
    const { isReady, isFailed } = this.state
    if (!isReady || isFailed) return null
    return (
      <View style={[styles.container, this.props.style]}>
        <BannerAd
          unitId={AdsModule.bannerUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          onAdFailedToLoad={e => {
            console.log("banner error:", e)
            this.setStateSafe({ isFailed: true })
          }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
});
