import 'react-native-gesture-handler';
import {Alert, AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import Constants from './src/config/Constants';

// Must be outside of any component LifeCycle (such as `componentDidMount`).
PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token) {
    PushNotification.createChannel(
      {
        channelId: Constants.androidNotificationChannelId, // (required)
        channelName: 'Niedersachsischerlandkreistag notification channel', // (required)
      },
      created => {
        console.log('created', created);
      },
    );
    console.log('TOKEN:', token);
  },

  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function (notification) {
    console.log('ACTION:', notification.action);
    console.log('NOTIFICATION:', notification);

    // process the action
  },

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function (err) {
    console.error(err.message, err);
  },

  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  popInitialNotification: true,
  requestPermissions: true,
});

// reset badge number after opening app
Platform.OS === 'ios' && PushNotificationIOS.setApplicationIconBadgeNumber(0);

messaging().setBackgroundMessageHandler(async remoteMessage => {
  // do something
});

AppRegistry.registerComponent(appName, () => App);
