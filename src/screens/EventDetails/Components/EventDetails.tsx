import React, {FC, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  BackHandler,
  ScrollView,
  StatusBar,
  Alert,
  ImageBackgroundBase,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import RenderHtml from 'react-native-render-html';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import LinearGradient from 'react-native-linear-gradient';

// images
import BackIcon from '../../../assets/images/back.png';
import BackWhiteIcon from '../../../assets/images/backWhite.png';

// custom
import {EventType} from '../../../types/responses/EventsListResponseType';
import {useContainerStyles} from '../../../styles/elements';
import {usePrimaryStyles} from '../../../hooks/useThemeStyles';
import {useColors} from '../../../styles/shared/Colors';
import {useAppSelector} from '../../../hooks/useRedux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import NavigationService from '../../../services/NavigationService';
import {ScreenID} from '../../../navigation/types';
import DetailsBannerImage from '../../../components/DetailsBannerImage';
import {c, f, l, t} from '../../../styles/shared';
import Text from '../../../components/Text';
import {useCoordsFromAddress, useSingleEvent} from '../hook';
import WebView from 'react-native-webview';
import moment from 'moment';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {getParsedTextFromHTML} from '../../../utils/HTMLParser';
import AutoHeightWebView from 'react-native-autoheight-webview';
import {FontsSelector, ThemeSelector} from '../../../store/Configuration';
import {useFontFamily} from '../../../components/AppFonts';
import {color} from 'react-native-reanimated';
import Button from '../../../components/Button';
import DeviceHelper from '../../../config/DeviceHelper';
import {PERMISSIONS} from 'react-native-permissions';

// custom

interface Props {
  event: EventType;
}

interface Location {
  latitude: number;
  longitude: number;
}

interface TAB {
  name: string;
  id: number;
}

const TABS = [
  {
    name: 'Details',
    id: 0,
  },
  {
    name: 'Authors',
    id: 1,
  },
  {
    name: 'Gallery',
    id: 2,
  },
];

const FontScales = ['75%', '100%', '125%', '150%'];

const EventDetailsStyle1: FC<Props> = ({event}) => {
  const ContainerStyles = useContainerStyles();
  const primaryColor = usePrimaryStyles().color;
  const colors = useColors();
  const appTheme = useAppSelector(ThemeSelector());
  const {eventDetails} = useSingleEvent(event.id);
  const fontFamily = useFontFamily();

  // const fonts = useAppSelector(FontsSelector());
  // const normalFont = fonts.filter(font => {
  //   return font.fontWeight == '300';
  // });

  // const fontUrl = normalFont[0]
  //   ? normalFont[0].fontURL
  //   : fonts?.[0]?.fontURL || '';

  const getAddress = () => {
    let address = '';
    eventDetails?.address_1
      ? (address += `${address ? ', ' : ''}${eventDetails?.address_1}`)
      : '';
    eventDetails?.address_2
      ? (address += `${address ? ', ' : ''}${eventDetails?.address_2}`)
      : '';
    eventDetails?.city
      ? (address += `${address ? ', ' : ''}${eventDetails?.city}`)
      : '';
    eventDetails?.zip_code
      ? (address += `${address ? ', ' : ''}${eventDetails?.zip_code}`)
      : '';

    return address;
  };

  const address = getAddress();
  //  eventDetails?.location
  //   ? // @ts-ignore
  //     (eventDetails.address_1 || '')
  //       .concat(', ')
  //       .concat(eventDetails.address_2 || '')
  //       .concat(', ')
  //       .concat(eventDetails.city || '')
  //   : '';

  const {location} = useCoordsFromAddress(address);
  const {bottom, top} = useSafeAreaInsets();

  // refs
  const scrollRef = useRef();

  // state
  const [showFadeAnimate, setShowFadeAnimate] = useState(false);

  const renderMap = (location: Location) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
       <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Quick Start - Leaflet</title>
          <link rel="shortcut icon" type="image/x-icon" href="docs/images/favicon.ico" />
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css" integrity="sha512-hoalWLoI8r4UszCkZ5kL8vayOGVae1oxXe/2A4AO6J9+580uKHDO3JdHb7NzwwzK5xr/Fs0W40kiNHxM9vyTtQ==" crossorigin=""/>
          <script src="https://unpkg.com/leaflet@1.8.0/dist/leaflet.js" integrity="sha512-BB3hKbKWOc9Ez/TAwyWxNXeoV9c1v6FIeYiBieIWkpLjauysF18NzgR1MBNBXf8/KABdlkX68nAhlwcDFLGPCQ==" crossorigin=""></script>
          <style>
             html, body {
             height: 100%;
             margin: 0;
             }
             .leaflet-container {
             height: 100%;
             width: 100%;
             max-width: 100%;
             max-height: 100%;
             }
          </style>
       </head>
       <body>
          <div id="map" style="width: 600px; height: 400px;"></div>
          <script>
             var map = L.map('map').setView([${location.latitude}, ${location.longitude}], 15);
             
             var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
               maxZoom: 20,
              //  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
             }).addTo(map);
             
             var marker = L.marker([${location.latitude}, ${location.longitude}]).addTo(map)
               // .bindPopup('<b>Hello world!</b><br />I am a popup.').openPopup();
             
             // var circle = L.circle([51.508, -0.11], {
             // 	color: 'red',
             // 	fillColor: '#f03',
             // 	fillOpacity: 0.5,
             // 	radius: 500
             // }).addTo(map).bindPopup('I am a circle.');
             
             // var polygon = L.polygon([
             // 	[51.509, -0.08],
             // 	[51.503, -0.06],
             // 	[51.51, -0.047]
             // ]).addTo(map).bindPopup('I am a polygon.');
             
             
             
             function onMapClick(e) {
               popup
                 .setLatLng(e.latlng)
                 .setContent('You clicked the map at ' + e.latlng.toString())
                 .openOn(map);
             }
             
             map.on('click', onMapClick);
             
          </script>
       </body>
    </html>
    `;
  };

  const goBack = () => {
    NavigationService.goBack();
  };

  const presentCalendarDialog = (item: EventType) => {
    AddCalendarEvent.presentEventCreatingDialog({
      title: item.title,
      // startDate: new Date(item.start_date).toISOString(),
      startDate: moment
        .utc(item.start_date_UTC)
        .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
      endDate: moment
        .utc(item.end_date_UTC)
        .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),

      // endDate: new Date(item.end_date).toISOString(),
    })
      .then(eventInfo => {})
      .catch((error: string) => {
        // handle error such as when user rejected permissions
        console.log('err', error);
      });
  };

  const addEventToCalendar = async (item: EventType) => {
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

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    console.log('eeeee', e?.nativeEvent);
    if (e?.nativeEvent?.contentOffset.y <= 10) {
      setShowFadeAnimate(false);
    }
    //  else {
    //   setShowFadeAnimate(true);
    // }
  };

  const isSameDay = (date1: string, date2: string) => {
    return moment(date1).isSame(moment(date2), 'date');
  };

  const linearGradientColors =
    appTheme === 'dark'
      ? ['rgba(18, 18, 18, 0)', 'rgba(18, 18, 18, 0.7)']
      : ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.7)'];

  return (
    <View style={[ContainerStyles]}>
      {/* <Header useBack title={' '} /> */}
      <StatusBar barStyle={'light-content'} networkActivityIndicatorVisible />
      <View
        style={[
          styles.statusBar,
          {height: top, backgroundColor: 'rgba(0,0,0,0.5)'},
        ]}
      />

      {/* banner image */}
      <View style={[]}>
        <TouchableOpacity
          style={[
            styles.backIconContainer,
            {top: top + 10, backgroundColor: colors.white},
          ]}
          onPress={goBack}>
          <Image
            source={appTheme === 'light' ? BackIcon : BackWhiteIcon}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            event?.event_image_url &&
              NavigationService.pushToScreen(ScreenID.FullScreenImage, {
                imageUrl: event?.event_image_url,
              });
          }}>
          <ImageBackground
            style={[
              styles.bannerImg,
              true ? {borderRadius: 0, height: 280} : {borderRadius: 10},
            ]}
            // @ts-ignore
            source={{uri: event?.event_image_url}}></ImageBackground>
        </TouchableOpacity>
      </View>

      {showFadeAnimate && (
        <LinearGradient
          colors={linearGradientColors}
          style={{
            height: 90,
            marginTop: 280,
            width: '100%',
            position: 'absolute',
            zIndex: 999,
            transform: [{rotate: '180deg'}],
          }}></LinearGradient>
      )}

      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor: ContainerStyles.backgroundColor,
          ...l.p20,
        }}
        contentContainerStyle={[l.pb30]}
        // @ts-ignore
        ref={scrollRef}
        onScrollBeginDrag={e => {
          // handleScroll(e);
          setShowFadeAnimate(true);
        }}
        onScrollEndDrag={e => {
          handleScroll(e);
        }}
        onMomentumScrollEnd={e => {
          handleScroll(e);
        }}>
        {/* event tag */}

        <View style={[l.flexRow]}>
          <View
            style={[
              {backgroundColor: primaryColor},
              l.p5,
              l.defaultBorderRadius,
              l.mt5,
            ]}>
            <Text style={[t.pSM, {color: c.white}]}>
              {eventDetails?.event_mode_id === 1
                ? 'Kostenlos'
                : 'Kostenpflichtig'}
            </Text>
          </View>
        </View>

        {/* title */}
        <View style={[l.mt10]}>
          <Text style={[t.h3, f.fontWeightMedium, {lineHeight: 28}]}>
            {event.title}
          </Text>
        </View>

        {event.start_date ? (
          <>
            {isSameDay(event.start_date, event.end_date) ? (
              <>
                <View style={[l.flexRow, l.alignCtr, l.mt15]}>
                  {/* start date */}
                  <View style={[l.flexRow, l.alignCtr]}>
                    <Icon name={'event'} size={20} color={colors.black150} />
                    <Text
                      style={[
                        l.ml5,
                        t.h5,
                        // f.fontWeightMedium,
                        {color: colors.black200},
                      ]}>
                      {moment(event.start_date).format('DD.MM.YYYY')}
                      {/* {' | '}
                      {moment(event.start_date).format('HH:mm')} */}
                    </Text>
                  </View>

                  {/* time */}
                  <View style={[l.flexRow, l.alignCtr, l.ml25]}>
                    <Icon name={'schedule'} size={20} color={colors.black200} />
                    <Text
                      style={[
                        l.ml5,
                        t.h5,
                        // f.fontWeightMedium,
                        {color: colors.black200},
                      ]}>
                      {moment(event.start_date).format('HH:mm')}
                      {event.end_date && (
                        <>
                          {' - '}
                          {moment(event.end_date).format('HH:mm')}
                        </>
                      )}
                    </Text>
                  </View>
                </View>
              </>
            ) : (
              <>
                <View style={[l.flexRow, l.alignCtr, l.mt15]}>
                  {/* start date */}
                  <View style={[l.flexRow, l.alignCtr]}>
                    <Icon name={'event'} size={20} color={colors.black150} />
                    <Text
                      style={[
                        l.ml5,
                        t.h5,
                        // f.fontWeightMedium,
                        {color: colors.black200},
                      ]}>
                      {moment(event.start_date).format('DD.MM.YYYY')}
                      {' | '}
                      {moment(event.start_date).format('HH:mm')}
                    </Text>
                  </View>

                  {/* end date */}
                  {event.end_date ? (
                    <>
                      <View style={[l.flexRow, l.alignCtr]}>
                        <Text>{'  — '}</Text>
                        <Text
                          style={[
                            l.ml5,
                            t.h5,
                            // f.fontWeightMedium,
                            {color: colors.black200},
                          ]}>
                          {moment(event.end_date).format('DD.MM.YYYY')}
                          {' | '}
                          {moment(event.end_date).format('HH:mm')}
                        </Text>
                      </View>
                    </>
                  ) : null}
                </View>
              </>
            )}
          </>
        ) : null}

        {/* if:online meeting URL */}
        {event.event_type_name === 'Online' && eventDetails?.meeting_url ? (
          <View style={[l.mt20]}>
            <Text style={[t.h5, f.fontWeightMedium, l.mb10]}>
              {'Teilnahme-Link'}
            </Text>
            <Text style={[t.h5SM, {color: colors.black200}]}>
              {eventDetails?.meeting_url}
            </Text>
          </View>
        ) : null}

        {/* event location */}
        {eventDetails?.location && address ? (
          <View style={[l.mt20]}>
            <Text style={[t.h5, f.fontWeightMedium, l.mb10]}>{'Adresse'}</Text>
            <Text style={[t.h5SM, {color: colors.black200}]}>{address}</Text>

            {location ? (
              <WebView
                source={{
                  // uri: 'https://www.openstreetmap.org/?mlat=52.3799&mlon=9.7184#map=12/52.3799/9.7184',
                  html: renderMap(location),
                }}
                style={{
                  height: 150,
                  width: '100%',
                  borderRadius: 10,
                  overflow: 'hidden',
                  ...l.mt15,
                }}></WebView>
            ) : null}
          </View>
        ) : null}

        {event.description ? (
          <View style={[l.mt30]}>
            {/* <Text style={[t.h4, f.fontWeightMedium, l.mb10]}>
              {'Description'}
            </Text> */}
            <Text style={[f.fontWeightMedium, t.h5]}>Beschreibung</Text>
            <RenderHtml
              contentWidth={Dimensions.get('window').width}
              source={{
                html: event.description,
              }}
              baseStyle={{
                color: colors.black200,
                fontSize: 16,
                lineHeight: 22,
                fontFamily,
              }}
              systemFonts={[fontFamily]}
            />
            {/* <AutoHeightWebView
              startInLoadingState={true}
              scrollEnabled={false}
              overScrollMode={'never'}
              javaScriptEnabled={true}
              javaScriptCanOpenWindowsAutomatically={true}
              scalesPageToFit={false}
              hasTVPreferredFocus={false}
              style={{width: '100%', ...l.mt5, backgroundColor: colors.white}}
              customStyle={`
                       * { 
                       touch-action: none;
                     -webkit-touch-callout: none;
                     -webkit-user-select: none;
                     -khtml-user-select: none;
                     -moz-user-select: none;
                     -ms-user-select: none;
                     user-select: none;
                     
                     
                   }
                 `}
              source={{
                html: `
                <!DOCTYPE html>
                <html>
                  <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <style>
                       
                        @font-face {
                          font-family: myFont;
                          
                        }  
                        html {background-color: ${colors.white}}
                        body { font-size: 14; word-wrap: break-word; overflow-wrap: break-word;font-family: myFont; color:${colors.black400}}
                      
                    </style>
                  </head>
                  <body><p><strong>Lorem Ipsum</strong> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p></body>
                </html>
            `,
              }}
              androidLayerType={'hardware'}
              // style={}
            ></AutoHeightWebView> */}

            {/* Contact Details */}
            {eventDetails?.contact_person_name ||
            eventDetails?.contact_person_email ||
            eventDetails?.contact_person_email ? (
              <View style={[l.mt20]}>
                <Text style={[t.h5, f.fontWeightMedium, l.mb5]}>
                  {'Ansprechpartner'}
                </Text>
                {/* name */}
                {eventDetails?.contact_person_name ? (
                  <View style={[l.flexRow, l.alignCtr, l.mt10]}>
                    <Icon name={'badge'} color={colors.black200} size={16} />
                    <Text style={[t.h5, l.ml10, {color: colors.black200}]}>
                      {eventDetails?.contact_person_name}
                    </Text>
                  </View>
                ) : null}
                {/* phone */}
                {eventDetails?.contact_person_phone ? (
                  <View style={[l.flexRow, l.alignCtr, l.mt10]}>
                    <Icon name={'call'} color={colors.black200} size={16} />
                    <Text style={[t.h5, l.ml10, {color: colors.black200}]}>
                      {eventDetails?.contact_person_phone}
                    </Text>
                  </View>
                ) : null}
                {/* email */}
                {eventDetails?.contact_person_email ? (
                  <View style={[l.flexRow, l.alignCtr, l.mt10]}>
                    <Icon name={'email'} color={colors.black200} size={16} />
                    <Text style={[t.h5, l.ml10, {color: colors.black200}]}>
                      {eventDetails?.contact_person_email}
                    </Text>
                  </View>
                ) : null}
              </View>
            ) : null}
          </View>
        ) : null}
      </ScrollView>

      <View style={[l.p20, {paddingBottom: useSafeAreaInsets().bottom + 10}]}>
        <Button
          theme={'primary'}
          title={'Zum Kalender hinzufügen'}
          widgetStyles={{
            text: [],
            // container: [{minHeight: 40}],
          }}
          onPress={() => {
            addEventToCalendar(event);
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerImg: {
    height: 200,
    ...l.fullWidth,
    overflow: 'hidden',
  },
  statusBar: {
    position: 'absolute',
    width: '100%',
    zIndex: 999,
  },
  relatedNewsImage: {
    height: 35,
    width: 35,
    ...l.defaultBorderRadius,
  },
  backIconContainer: {
    position: 'absolute',
    backgroundColor: 'red',
    // ...l.p10,
    left: 20,
    zIndex: 999,
    borderRadius: 20,
    height: 35,
    width: 35,
    ...l.flexRow,
    ...l.alignCtr,
    ...l.justifyCtr,
  },
  backIcon: {
    width: 18,
    height: 10,
  },
});

export default EventDetailsStyle1;
