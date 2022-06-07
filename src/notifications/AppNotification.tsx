import {useEffect} from 'react';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import Constants from '../config/Constants';

const AppNotification = () => {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      PushNotification.localNotification({
        title: remoteMessage.notification?.title,
        message: remoteMessage.notification?.body ?? '',
        userInfo: remoteMessage.data,
        channelId: Constants.androidNotificationChannelId,
      });
    });

    return unsubscribe;
  }, []);

  return null;
};

export default AppNotification;
