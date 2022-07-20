import React, {FC, useEffect, useRef, useState} from 'react';
import {Alert, Dimensions, Linking, Platform, View} from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview';
import Orientation, {OrientationType} from 'react-native-orientation-locker';
import WebView from 'react-native-webview';
import {useSelector} from 'react-redux';

// custom
import Text from '../../../components/Text';
import DeviceHelper from '../../../config/DeviceHelper';
import {useAppSelector} from '../../../hooks/useRedux';
import {FontsSelector} from '../../../store/Configuration';
import {c, f, l, t} from '../../../styles/shared';
import {useColors} from '../../../styles/shared/Colors';
import {PostType} from '../../../types/responses/PostsListResponseType';
import RenderHtml from 'react-native-render-html';

// custom
import {SingleNewsType} from '../../../types/responses/SingleNewsResposeType';
import {useFontFamily} from '../../../components/AppFonts';

interface Props {
  postDetails: PostType | undefined;
  fontSize: number;
  fontUrl: string;
  scrollToTop: () => void;
}

const Description: FC<Props> = ({
  postDetails,
  fontSize,
  fontUrl,
  scrollToTop,
}) => {
  const colors = useColors();

  const wrapHtml = (
    htmlContent: string,
    fontSize: number,
    fontUrl: string = '',
    textColor: string,
  ) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
             
              @font-face {
                font-family: myFont;
                src: url(${fontUrl}) format('truetype');
              }  
              html {background-color: ${colors.white}}
              body { font-size: ${fontSize}px; word-wrap: break-word; overflow-wrap: break-word;font-family: myFont; color:${textColor}}
            
          </style>
        </head>
        <body>${htmlContent}</body>
      </html>
  `;
  };

  const introduction = postDetails?.introduction
    ? wrapHtml(postDetails?.introduction, fontSize, fontUrl, colors.black400)
    : '';

  const description = postDetails?.description
    ? wrapHtml(postDetails?.description, fontSize, fontUrl, colors.black400)
    : '';

  const fontFamily = useFontFamily();

  return (
    <View
      style={{
        // flex: 1,
        height: '100%',
      }}>
      <RenderHtml
        contentWidth={Dimensions.get('window').width}
        source={{html: postDetails?.introduction || ''}}
        baseStyle={{
          color: colors.black400,
          fontSize: fontSize,
          lineHeight: fontSize * 1.5,
          fontFamily,
        }}
        systemFonts={[fontFamily]}
      />

      <RenderHtml
        contentWidth={Dimensions.get('window').width}
        source={{html: postDetails?.description || ''}}
        baseStyle={{
          color: colors.black400,
          fontSize: fontSize,
          lineHeight: fontSize * 1.5,
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
        style={{width: '100%', ...l.mt5}}
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
        onLoadStart={() => {
          scrollToTop?.();
        }}
        source={{html: `${introduction}\n\n${description}`}}
        allowsFullscreenVideo={true}
        onShouldStartLoadWithRequest={request => {
          if (
            (request.navigationType === 'click' || Platform.OS === 'android') &&
            request.url
          ) {
            Linking.openURL(request.url);
            return false;
          }
          return true;
        }}
        androidLayerType={'hardware'}
      /> */}
    </View>
  );
};

export default Description;
