/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import MainScreen from './src/views/MainScreen';
import BaseApp from './src/views/BaseApp';

AppRegistry.registerComponent(appName, () => BaseApp);
