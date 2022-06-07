import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet, View} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import ToggleSwitch from 'toggle-switch-react-native';
import DateTimePicker, {Event} from '@react-native-community/datetimepicker';

// custom
import Header from '../../components/Header';
import Text from '../../components/Text';
import Constants from '../../config/Constants';
import {usePrimaryStyles} from '../../hooks/useThemeStyles';
import {BoxShadowStyles, ContainerStyles} from '../../styles/elements';
import {c, f, l, t} from '../../styles/shared';
import Button from '../../components/Button';
import {
  showNotification,
  cancelAllNotifications,
} from '../../notifications/index';
import moment from 'moment';
import Toast from 'react-native-toast-message';

import {useAppDispatch, useAppSelector} from '../../hooks/useRedux';
import {
  scheduledRemindersSelector,
  setScheduledReminders,
} from '../../store/Configuration';
import DeviceHelper from '../../config/DeviceHelper';

interface Reminder {
  id?: number;
  name?: string;
  defaultTime?: string;
  enabled?: boolean;
  notificationTime?: string;
}

const Reminders = () => {
  const dispatch = useAppDispatch();
  const scheduledReminders = useAppSelector(scheduledRemindersSelector());
  const {bottom} = useSafeAreaInsets();
  const primaryColor = usePrimaryStyles().color;

  // state
  const [reminders, setReminders] = useState<Array<Reminder>>(
    scheduledReminders && scheduledReminders.length > 1
      ? scheduledReminders
      : Constants.Reminders,
  );
  const [enableSave, setEnableSave] = useState(true);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currTimePickerReminder, setCurrentTimePickerReminder] =
    useState<Reminder>({});
  // const [showTimePickerTime, setShowTimePickerTime] = useState('');
  const [currTimePickerReminderTime, setCurrTimePickerReminderTime] =
    useState('');

  const onReminderToggle = (toggledReminder: Reminder, isOn: boolean) => {
    const myReminders = reminders.map(reminder => {
      if (toggledReminder.id === reminder.id) {
        return {
          ...reminder,
          enabled: isOn,
        };
      }
      return reminder;
    });

    setReminders(myReminders);
    setEnableSave(true);
  };

  const onReminderTimePress = (reminder: Reminder) => {
    setCurrentTimePickerReminder(reminder);
    setShowTimePicker(true);
    setEnableSave(true);
  };

  const onCurrReminderTimeSelected = () => {
    const myReminders = reminders.map(reminder => {
      if (currTimePickerReminder.id === reminder.id) {
        return {
          ...reminder,
          notificationTime: currTimePickerReminderTime,
        };
      }
      return reminder;
    });

    setReminders(myReminders);
    setShowTimePicker(false);
  };

  const onReminderTimeChange = (event: Event, time: Date | undefined) => {
    const formattedTime = moment(time).format('HH:mm');
    setCurrTimePickerReminderTime(formattedTime);
    if (!DeviceHelper.isIOS) {
      const myReminders = reminders.map(reminder => {
        if (currTimePickerReminder.id === reminder.id) {
          return {
            ...reminder,
            notificationTime: formattedTime,
          };
        }
        return reminder;
      });

      setReminders(myReminders);
      setShowTimePicker(false);
    }
  };

  const onSaveRemindersPress = () => {
    try {
      // cancel all previous  scheduled reminders
      cancelAllNotifications();
      // shcedule new reminders
      reminders.map(reminder => {
        const reminderNotificationTime =
          reminder.notificationTime || reminder.defaultTime;
        if (reminder.enabled && reminderNotificationTime) {
          showNotification(
            reminder.id?.toString() || '',
            'Erinnerungen',
            reminder.name || '',
            reminderNotificationTime,
          );
        }
      });
      // set scheduled reminders in redux
      dispatch(setScheduledReminders(reminders));
      // successfully scheduled reminders message
      Toast.show({
        type: 'success',
        position: 'top',
        topOffset: 100,
        text1: 'Erfolgreich erstellte Erinnerungen!',
        text2: '',
        visibilityTime: 2000,
      });
      setEnableSave(false);
    } catch (error) {
      // failed  to schedule reminders message
      Toast.show({
        type: 'error',
        position: 'top',
        topOffset: 100,
        text1: 'Oops!',
        text2:
          'Es ist ein Fehler beim Erstellen von Erinnerungen aufgetreten, bitte versuchen Sie es erneut!',
        visibilityTime: 2000,
      });
    }
  };

  return (
    <View style={[ContainerStyles, {position: 'relative'}]}>
      <Header useBack title={'Erinnerungen'} />
      <ScrollView
        bounces={false}
        contentContainerStyle={[l.p20, {paddingBottom: bottom + 110}]}>
        {reminders.map((reminder: Reminder, i) => {
          return (
            <View
              key={i}
              style={[styles.reminderContainer, i !== 0 ? l.mt15 : {}]}>
              <View style={[l.flex, l.mr15]}>
                <Text style={[f.fontWeightMedium]}>{reminder.name}</Text>
                <View style={[l.flexRow, l.mt10]}>
                  <Button
                    title={
                      reminder.notificationTime || reminder.defaultTime || ''
                    }
                    theme={'simplePrimary'}
                    onPress={() => {
                      onReminderTimePress(reminder);
                    }}
                  />
                </View>
              </View>
              <ToggleSwitch
                // @ts-ignore
                isOn={reminder.enabled}
                onColor={primaryColor}
                offColor={c.grey50}
                size="medium"
                onToggle={isOn => {
                  onReminderToggle(reminder, isOn);
                }}
              />
            </View>
          );
        })}
      </ScrollView>

      {/* save button */}
      {true && (
        <View style={[styles.saveBtnContainer, {paddingBottom: bottom + 20}]}>
          <Button
            title={'Speichern'}
            theme={'primary'}
            onPress={onSaveRemindersPress}
          />
        </View>
      )}

      {/* timepicker */}
      {showTimePicker ? (
        <>
          {DeviceHelper.isIOS ? (
            <View
              style={[
                styles.timePickerContainer,
                {paddingBottom: bottom},
                BoxShadowStyles,
              ]}>
              <View style={[l.pt15, l.px15, l.flexRow, l.justifyEnd]}>
                <Button
                  title={'Done'}
                  theme={'simplePrimary'}
                  widgetStyles={{
                    text: {
                      ...t.h5,
                    },
                  }}
                  onPress={onCurrReminderTimeSelected}
                />
              </View>

              <DateTimePicker
                testID="dateTimePicker"
                value={moment(
                  currTimePickerReminderTime ||
                    currTimePickerReminder.notificationTime ||
                    currTimePickerReminder.defaultTime,
                  'HH:mm',
                ).toDate()}
                mode={'time'}
                is24Hour={true}
                display="spinner"
                onChange={(e, t) => {
                  onReminderTimeChange(e, t);
                }}
                style={{flex: 1}}
              />
            </View>
          ) : (
            <DateTimePicker
              testID="dateTimePicker"
              value={moment(
                currTimePickerReminderTime ||
                  currTimePickerReminder.notificationTime ||
                  currTimePickerReminder.defaultTime,
                'HH:mm',
              ).toDate()}
              mode={'time'}
              is24Hour={true}
              display="spinner"
              onChange={(e, t) => {
                setShowTimePicker(false);
                onReminderTimeChange(e, t);
              }}
              style={{flex: 1}}
            />
          )}
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  reminderContainer: {
    backgroundColor: c.white,
    ...l.p15,
    ...l.defaultBorderRadius,
    ...l.flexRow,
    ...l.alignCtr,
  },
  saveBtnContainer: {
    ...l.p20,
    ...l.abs,
    bottom: 0,
    ...l.fullWidth,
    backgroundColor: c.white,
  },
  timePickerContainer: {
    // ...l.p20,
    ...l.abs,
    bottom: 0,
    ...l.fullWidth,
    backgroundColor: c.white,
    // borderWidth: 1,
    // ...l.flexRow,
    // ...l.justifyEnd,
  },
});

export default Reminders;
