/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import MyAppContainer from './src/container/App';
import { enableScreens } from 'react-native-screens';
import { IS_ANDROID } from './src/utils/DeviceUtil';
import { UIManager } from 'react-native';

enableScreens();

if (IS_ANDROID) {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

AppRegistry.registerComponent(appName, () => MyAppContainer);
