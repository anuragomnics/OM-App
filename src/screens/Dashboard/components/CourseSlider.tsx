import React, {FC, useEffect, useRef, useState} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  AppState,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ImageEditor from '@react-native-community/image-editor';
import to from 'await-to-js';

// custom
import {c, f, l, t} from '../../../styles/shared';
import {CourseSlider as CourseSlidertype} from '../../../types/responses/SettingResponseType';
import Text from '../../../components/Text';
import {Course as CourseType} from '../../../types/responses/SettingResponseType';
import {getParsedTextFromHTML} from '../../../utils/HTMLParser';
import {EventType} from '../../../types/responses/EventsResponseType';
import {NewsType} from '../../../types/responses/NewsResponsetype';
import NavigationService from '../../../services/NavigationService';
import {ScreenID} from '../../../navigation/types';
import WebView from 'react-native-webview';
import {useNavigation} from '@react-navigation/core';

const deviceWidth = Dimensions.get('window').width;

const courseItemMargin = 15;

const CourseSlider: FC<CourseSlidertype> = ({
  title,
  type,
  item_number_per_slider = 1,
  ...rest
}) => {
  // ref
  const WebviewRef = useRef(null);

  // state
  const [imageUrls, setImageUrls] = useState({});
  const navigation = useNavigation();
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        // @ts-ignore
        WebviewRef.current?.reload?.();
      }
    });

    return () => {
      // @ts-ignore
      subscription?.remove();
    };
  }, []);
  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     WebviewRef.current?.reload?.();
  //   });

  //   // Return the function to unsubscribe from the event so it gets removed on unmount
  //   return unsubscribe;
  // }, []);

  const renderImage = (imageUrl: string, backgroundPosition: string = '') => {
    return `<!DOCTYPE html>
      <html>
      <head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>
      body { 
        pointer-events:none;overflow:hidden;
        background-image: url('${imageUrl}');
        background-repeat: no-repeat;
        background-attachment: fixed;
        background-size: cover;
        ${backgroundPosition}
      }
      </style>
      </head>
      <body>
      </body>
      </html>`;
  };

  const propertyName: string =
    type === 'course_slider'
      ? 'courses'
      : type === 'event_slider'
      ? 'events'
      : 'news';
  // @ts-ignore
  const DATA: Array<CourseType | EventType | NewsType> = rest[propertyName];
  const endSlideWidth = item_number_per_slider === 1 ? 70 : 40;
  const courseItemWidth =
    deviceWidth / item_number_per_slider -
    item_number_per_slider * courseItemMargin -
    endSlideWidth / item_number_per_slider;
  const isSingleItem = DATA.length === 1;

  const onPress = (item: CourseType | EventType | NewsType) => {
    if (type === 'course_slider') {
      NavigationService.pushToScreen(ScreenID.CouseDetails, {
        course: item,
        fromSlider: true,
      });
    } else if (type === 'event_slider') {
      NavigationService.pushToScreen(ScreenID.EventDetails, {
        event: item,
        fromSlider: true,
      });
    } else if (type === 'news_slider') {
      NavigationService.pushToScreen(ScreenID.NewsDetails, {
        news: item,
        fromSlider: true,
      });
    }
  };

  return (
    <View style={[l.mb30]}>
      <Text style={[t.h3, f.fontWeightMedium]}>{title}</Text>
      <ScrollView
        style={[l.mt10]}
        contentContainerStyle={[
          l.flexRow,
          isSingleItem ? {...l.fullWidth} : {},
          // l.fullWidth,
        ]}
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}>
        {DATA.map((item, index) => {
          let description = item.description;
          if (type !== 'course_slider') {
            description = getParsedTextFromHTML(item.description);
          }
          const {css_bg_position} = item?.image_focus_point;

          return (
            <TouchableOpacity
              key={index}
              style={{
                marginRight: isSingleItem
                  ? 0
                  : index !== DATA.length - 1
                  ? courseItemMargin
                  : 0,
                backgroundColor: c.white,
                ...l.defaultBorderRadius,
                overflow: 'hidden',
                width: isSingleItem ? '100%' : courseItemWidth,
              }}
              onPress={() => {
                onPress(item);
              }}>
              <WebView
                ref={WebviewRef}
                style={{
                  width: '100%',
                  height: isSingleItem
                    ? 150
                    : item_number_per_slider === 1
                    ? 150
                    : 100,
                }}
                javaScriptEnabled={true}
                scrollEnabled={false}
                androidLayerType={'hardware'}
                androidHardwareAccelerationDisabled
                source={{
                  html: renderImage(item.image, css_bg_position),
                }}></WebView>
              {/* <FastImage
                // @ts-ignore
                source={{uri: item.image}}
                style={{
                  width: '100%',
                  height: isSingleItem
                    ? 150
                    : item_number_per_slider === 1
                    ? 150
                    : 100,
                }}
                resizeMode={FastImage.resizeMode.cover}
              /> */}
              <View style={[l.p10]}>
                <Text
                  numberOfLines={item_number_per_slider === 1 ? 2 : 1}
                  style={[f.fontWeightMedium]}>
                  {/* @ts-ignore */}
                  {item.name}
                </Text>
                {/* {item_number_per_slider === 1 && (
                  <Text
                    numberOfLines={2}
                    style={[l.mt5, t.lh18, {color: c.black200}]}>
                    {description ? description : ''}
                  </Text>
                )} */}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default CourseSlider;
