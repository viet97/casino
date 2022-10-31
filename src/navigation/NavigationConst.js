import DetailScreen from '../components/screen/DetailScreen';
import HistoryScreen from '../components/screen/HistoryScreen';
import HomeScreen from '../components/screen/HomeScreen';
import SplashScreen from '../components/screen/SplashScreen';

export const ROUTER_NAME = {
  SPLASH: {
    title: 'Splash',
    name: 'SplashScreen',
    component: SplashScreen,
  },
  HISTORY: {
    title: 'History',
    name: 'HistoryScreen',
    component: HistoryScreen,
  },
  DETAIL: {
    title: 'Detail',
    name: 'DetailScreen',
    component: DetailScreen,
  },
  HOME: {
    title: 'Home',
    name: 'HomeScreen',
    component: HomeScreen,
  },
};