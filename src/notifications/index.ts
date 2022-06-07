import PushNotificationIOS, {
  NotificationRequest,
} from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import moment from 'moment';

//   custom
import Constants from '../config/Constants';
import DeviceHelper from '../config/DeviceHelper';

export const showNotification = (
  id: string,
  title: string,
  message: string,
  date: string,
) => {
  if (DeviceHelper.isIOS) {
    PushNotificationIOS.addNotificationRequest({
      id: id,
      title: title,
      body: message,
      fireDate: moment(date, 'HH:mm').toDate(),
      repeats: true,
      repeatsComponent: {
        hour: true,
        minute: true,
      },
    });
  } else {
    PushNotification.localNotificationSchedule({
      channelId: Constants.androidNotificationChannelId,
      title: title,
      message: message,
      date: moment(date, 'HH:mm').toDate(),
      repeatTime: 1,
      repeatType: 'day',
      largeIcon: '',
    });
  }
};

export const cancelAllNotifications = () => {
  if (DeviceHelper.isIOS) {
    PushNotificationIOS.removeAllPendingNotificationRequests();
  } else {
    PushNotification.cancelAllLocalNotifications();
  }
};
