import moment from 'moment';
import React, {FC, useState} from 'react';
import {Alert, PermissionsAndroid, StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import RNCalendarEvents from 'react-native-calendar-events';

// custom
import Text from '../../../components/Text';
import {usePrimaryStyles} from '../../../hooks/useThemeStyles';
import {c, f, l, t} from '../../../styles/shared';
import {
  SingleEventType,
  ModuleType,
} from '../../../types/responses/SingleEventResponseType';
import Button from '../../../components/Button';
import {PERMISSIONS} from 'react-native-permissions';
import DeviceHelper from '../../../config/DeviceHelper';

interface Props {
  event: SingleEventType | undefined;
}

const Schedule: FC<Props> = ({event}) => {
  const modules = event?.modules;
  const primaryColor = usePrimaryStyles().color;

  const presentCalendarDialog = (item: ModuleType) => {
    AddCalendarEvent.presentEventCreatingDialog({
      title: item.title,
      startDate: new Date(item.start_at).toISOString(),
      endDate: new Date(item.end_at).toISOString(),
    })
      .then(eventInfo => {
        console.log(JSON.stringify(eventInfo));
      })
      .catch((error: string) => {
        // handle error such as when user rejected permissions
        console.log('err', error);
      });
  };

  const addEventToCalendar = async (item: ModuleType) => {
    try {
      if (DeviceHelper.isIOS) {
        presentCalendarDialog(item);
      }
      if (!DeviceHelper.isIOS) {
        const hasWritePermission = await PermissionsAndroid.check(
          PERMISSIONS.ANDROID.WRITE_CALENDAR,
        );
        const hasReadPermission = await PermissionsAndroid.check(
          PERMISSIONS.ANDROID.READ_CALENDAR,
        );

        if (hasWritePermission && hasReadPermission) {
          presentCalendarDialog(item);
        } else {
          const requestWritePermission = await PermissionsAndroid.request(
            PERMISSIONS.ANDROID.WRITE_CALENDAR,
          );
          const requestReadPermission = await PermissionsAndroid.request(
            PERMISSIONS.ANDROID.READ_CALENDAR,
          );

          if (
            requestWritePermission === 'granted' &&
            requestReadPermission === 'granted'
          ) {
            presentCalendarDialog(item);
          }
        }
      }
    } catch (e) {
      console.log('err', e);
    }
  };

  return (
    <View>
      {(!modules || modules.length === 0) && (
        <View>
          <Text style={[t.h5]}>
            {'Schedule is not available for this event.'}
          </Text>
        </View>
      )}

      {/* {modules && modules.length > 0 && (
        <View style={[l.mb20]}>
          <Text style={[t.h4, f.fontWeightMedium]}>{'Event Schedule'}</Text>
        
        </View>
      )} */}

      {modules?.map((item, index) => {
        const address = item.place
          ? item.place.name
              .concat(', ')
              .concat(item.place.street || '')
              .concat(', ')
              .concat(item.place.city || '')
          : '';

        return (
          <View key={index} style={[l.flexRow, l.flex]}>
            <View style={[l.flex]}>
              {/* <Text style={[t.h5]}>{item.title}</Text> */}
              <View style={[l.flexRow, l.alignCtr, l.mt5]}>
                {event?.event_date ? (
                  <View style={[l.flexRow, l.alignCtr]}>
                    <Icon
                      name={'event-available'}
                      size={25}
                      color={c.black400}
                    />
                    <Text style={[t.h5, l.ml5]}>
                      {event?.event_date}
                      {' / '}
                    </Text>
                  </View>
                ) : null}
                <Text style={[t.h5]}>
                  {moment(item.start_at, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')}
                </Text>
                <Text>{'  -  '}</Text>
                <Text style={[t.h5]}>
                  {moment(item.end_at, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')}
                </Text>
                <Text style={[t.h5]}>{` Uhr`}</Text>
              </View>

              {/* Address */}
              {address ? (
                <Text
                  style={[
                    t.h5,
                    l.mt10,
                    {
                      color: c.black200,
                      lineHeight: 18,
                    },
                  ]}>
                  {address}
                </Text>
              ) : null}
              {/* <Button
                theme={'primary'}
                title={'Zum Kalender hinzufügen'}
                widgetStyles={{
                  container: [l.mt10, {minHeight: 40}],
                  text: [],
                }}
                onPress={() => {
                  addEventToCalendar(item);
                }}
              /> */}

              {modules && index !== modules?.length - 1 && (
                <View style={styles.divider} />
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 200,
    ...l.fullWidth,
  },
  divider: {
    height: 1,
    backgroundColor: c.grey100,
    ...l.my20,
  },
});

export default Schedule;
