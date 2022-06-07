import React, {FC, useEffect, useRef, useState} from 'react';
import {Alert, Dimensions, Linking, Platform, View} from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview';
import Orientation, {OrientationType} from 'react-native-orientation-locker';
import WebView from 'react-native-webview';
import {useSelector} from 'react-redux';
import Text from '../../../components/Text';
import DeviceHelper from '../../../config/DeviceHelper';
import {useAppSelector} from '../../../hooks/useRedux';
import {FontsSelector} from '../../../store/Configuration';
import {l} from '../../../styles/shared';

// custom
import {SingleNewsType} from '../../../types/responses/SingleNewsResposeType';

interface Props {
  newsDetails: SingleNewsType | undefined;
  fontSize: string;
  fontUrl: string;
  scrollToTop: () => void;
}

const wrapHtml = (
  htmlContent: string,
  fontSize: string = '100%',
  fontUrl: string = '',
) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            @font-face {
              font-family: myFont;
              src: url(${fontUrl});
            }  
            body { font-size: ${fontSize}; word-wrap: break-word; overflow-wrap: break-word;font-family: myFont;   }
          
        </style>
      </head>
      <body>${htmlContent}</body>
    </html>
`;
};

const Description: FC<Props> = ({
  newsDetails,
  fontSize,
  fontUrl,
  scrollToTop,
}) => {
  const introduction = newsDetails?.introduction
    ? wrapHtml(newsDetails?.introduction, fontSize, fontUrl)
    : '';

  const description = newsDetails?.description
    ? wrapHtml(newsDetails?.description, fontSize, fontUrl)
    : '';

  return (
    <View
      style={{
        // flex: 1,
        height: '100%',
      }}>
      <AutoHeightWebView
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
      />

      {/* {description ? (
        <AutoHeightWebView
          style={{width: Dimensions.get('window').width - 40, ...l.mt10}}
          customStyle={`
            * {   -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none; }

            `}
          javaScriptEnabled={true}
          source={{html: description}}
          scalesPageToFit={Platform.OS === 'android' ? false : false}
          scrollEnabled={false}
          allowsFullscreenVideo={true}
          onShouldStartLoadWithRequest={request => {
            if (request.navigationType === 'click' && request.url) {
              Linking.openURL(request.url);
              return false;
            }
            return true;
          }}
          androidLayerType={'hardware'}
        />
      ) : null} */}
    </View>
  );
};

export default Description;
