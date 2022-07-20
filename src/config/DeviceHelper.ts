import {Alert, Dimensions, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

const isIOS = Platform.OS === 'ios';
const width = isIOS
  ? Dimensions.get('window').width
  : require('react-native-extra-dimensions-android').get('REAL_WINDOW_WIDTH');
const height = isIOS
  ? Dimensions.get('window').height
  : require('react-native-extra-dimensions-android').get('REAL_WINDOW_HEIGHT');

const isIphoneX = isIOS && (height >= 812 || width >= 812);

const isSmallScreen = height <= 700;

export default {
  isIphoneX,
  toolBarHeight: isIphoneX ? 35 : 0,
  isSmallScreen,
  width,
  height,
  isIOS,
  platform: isIOS ? 'iOS' : 'Android',
  appVersion: `${DeviceInfo.getVersion()}`,
  deviceId: DeviceInfo.getDeviceId(),
  OS: Platform.OS,
};
