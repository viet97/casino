import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import BaseElement from '../BaseElement';
import AdsModule from '../../../modules/AdsModule';

const RETRY_DELAY = 30 * 1000

export default class Banner extends BaseElement {
  constructor(props) {
    super(props);
    this.state = {
      isReady: AdsModule.isReady,
      isFailed: false,
      retryCount: 0,
    };
  }

  _componentDidMount() {
    this.removeReadyListener = AdsModule.onReady(() => this.setStateSafe({ isReady: true }))
  }

  _componentWillUnmount() {
    this.removeReadyListener && this.removeReadyListener()
    clearTimeout(this.retryTimeout)
  }

  // Hide the banner and retry later (e.g. no network, no fill)
  onAdFailedToLoad = (e) => {
    console.log("banner error:", e)
    this.setStateSafe({ isFailed: true })
    clearTimeout(this.retryTimeout)
    this.retryTimeout = setTimeout(() => {
      this.setStateSafe({ isFailed: false, retryCount: this.state.retryCount + 1 })
    }, RETRY_DELAY)
  }

  renderContent() {
    const { isReady, isFailed, retryCount } = this.state
    if (!isReady || isFailed) return null
    return (
      <View style={[styles.container, this.props.style]}>
        <BannerAd
          key={retryCount}
          unitId={AdsModule.bannerUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          onAdFailedToLoad={this.onAdFailedToLoad}
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
