import React, {FC} from 'react';
import {Dimensions, View} from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview';
import WebView from 'react-native-webview';
import {l} from '../../../styles/shared';
import {SingleEventType} from '../../../types/responses/SingleEventResponseType';

interface Props {
  event: SingleEventType | undefined;
}

const AboutEvent: FC<Props> = ({event}) => {
  return (
    <View>
      {event?.description ? (
        <AutoHeightWebView
          style={{width: Dimensions.get('window').width - 40, ...l.mt5}}
          customStyle={`
                * {   -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none; }
          `}
          source={{html: event?.description}}
          scalesPageToFit={false}
          viewportContent={'width=device-width, user-scalable=no'}
          scrollEnabled={false}
          androidLayerType={'hardware'}
        />
      ) : null}
    </View>
  );
};

export default AboutEvent;
