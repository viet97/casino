import { Platform } from 'react-native';
import mobileAds, {
    AdEventType,
    AdsConsent,
    InterstitialAd,
    TestIds,
} from 'react-native-google-mobile-ads';

// Ad unit ids from AdMob console. Leave empty to use Google test ads.
const AD_UNIT_IDS = {
    ios: {
        banner: '',
        interstitial: '',
    },
    android: {
        banner: '',
        interstitial: '',
    },
}

// Minimum time between 2 interstitial ads
const INTERSTITIAL_INTERVAL = 3 * 60 * 1000

const getUnitId = (type, testId) => {
    const unitId = AD_UNIT_IDS[Platform.OS]?.[type]
    if (__DEV__ || !unitId) return testId
    return unitId
}

const AdsModule = {
    isReady: false,
    lastInterstitialShown: Date.now(),
    interstitial: null,
    isInterstitialLoaded: false,
    listeners: [],

    bannerUnitId: getUnitId('banner', TestIds.ADAPTIVE_BANNER),
    interstitialUnitId: getUnitId('interstitial', TestIds.INTERSTITIAL),

    init: async function () {
        try {
            // GDPR consent form (only shown in EEA/UK) and iOS ATT if configured in AdMob
            await AdsConsent.gatherConsent()
        } catch (e) {
            console.log("ads consent error:", e)
        }
        try {
            const { canRequestAds } = await AdsConsent.getConsentInfo()
            if (!canRequestAds) return
            await mobileAds().initialize()
            this.isReady = true
            this.listeners.forEach(listener => listener())
            this.loadInterstitial()
        } catch (e) {
            console.log("ads init error:", e)
        }
    },

    onReady: function (listener) {
        if (this.isReady) {
            listener()
            return () => { }
        }
        this.listeners.push(listener)
        return () => {
            this.listeners = this.listeners.filter(it => it !== listener)
        }
    },

    loadInterstitial: function () {
        if (!this.isReady) return
        if (!this.interstitial) {
            this.interstitial = InterstitialAd.createForAdRequest(this.interstitialUnitId)
            this.interstitial.addAdEventListener(AdEventType.LOADED, () => {
                this.isInterstitialLoaded = true
            })
            this.interstitial.addAdEventListener(AdEventType.CLOSED, () => {
                this.isInterstitialLoaded = false
                this.interstitial.load()
            })
            this.interstitial.addAdEventListener(AdEventType.ERROR, e => {
                this.isInterstitialLoaded = false
                console.log("interstitial error:", e)
            })
        }
        this.interstitial.load()
    },

    // Show interstitial if loaded and not shown recently
    showInterstitial: function () {
        if (!this.isInterstitialLoaded) {
            this.loadInterstitial()
            return false
        }
        if (Date.now() - this.lastInterstitialShown < INTERSTITIAL_INTERVAL) return false
        this.lastInterstitialShown = Date.now()
        this.isInterstitialLoaded = false
        this.interstitial.show().catch(e => console.log("show interstitial error:", e))
        return true
    },
}

export default AdsModule
