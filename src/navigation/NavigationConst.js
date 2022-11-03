import CreateScreen from '../components/screen/CreateScreen';
import DetailScreen from '../components/screen/DetailScreen';
import FightScreen from '../components/screen/FightScreen';
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
  CREATE_GAME: {
    title: 'Create',
    name: 'CreateScreen',
    component: CreateScreen,
  },
  FIGHT: {
    title: 'Fight',
    name: 'FightScreen',
    component: FightScreen,
  },
};