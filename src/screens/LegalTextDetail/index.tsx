import React, {FC, useEffect, useState} from 'react';
import {Dimensions, ScrollView, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Button from '../../components/Button';
import AutoHeightWebView from 'react-native-autoheight-webview';
import RenderHtml from 'react-native-render-html';

// custom
import Header from '../../components/Header';
import NavigationService from '../../services/NavigationService';
import {f, l, t} from '../../styles/shared';
import Text from '../../components/Text';
import {RouteProp} from '@react-navigation/core';
import {RootStackParams, ScreenID} from '../../navigation/types';
import {useThunkCallbackAction} from '../../hooks/useRedux';
import SpinnerLoader from '../../loaders/SpinnerLoader';
import {useSingleLawTextDetail} from './hook';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useContainerStyles} from '../../styles/elements';
import {useColors} from '../../styles/shared/Colors';
import {useFontFamily} from '../../components/AppFonts';

interface Props {
  route: RouteProp<RootStackParams, ScreenID.LegalTextDetail>;
}

const LegalTextDetail: FC<Props> = ({route}) => {
  // @ts-ignore
  const {content, id} = route.params;
  const {legalText, isLoading} = useSingleLawTextDetail(id);
  const colors = useColors();
  const ContainerStyles = useContainerStyles();
  const fontFamily = useFontFamily();

  const goBack = () => {
    NavigationService.goBack();
  };

  return (
    <>
      {isLoading && <SpinnerLoader />}
      {true && (
        <View style={[ContainerStyles]}>
          <Header
            rightIcon={{iconName: 'close', iconColor: colors.black400}}
            onRightIconPress={goBack}
          />
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            style={[
              l.p20,
              {
                marginBottom: useSafeAreaInsets().bottom,
              },
            ]}>
            {legalText ? (
              <View style={[l.mb30]}>
                {/* title */}
                <Text style={[t.h3, f.fontWeightBold, l.mb10]}>
                  {legalText?.title}
                </Text>
                {/* description */}
                {/* <AutoHeightWebView
                  style={{width: Dimensions.get('window').width - 40, ...l.mt5}}
                  customStyle={`
                          * {   -webkit-touch-callout: none;
                        -webkit-user-select: none;
                        -khtml-user-select: none;
                        -moz-user-select: none;
                        -ms-user-select: none;
                        user-select: none; }
                          `}
                  source={{html: legalText?.description || ''}}
                  scalesPageToFit={false}
                  scrollEnabled={false}
                  androidLayerType={'hardware'}
                /> */}

                <RenderHtml
                  contentWidth={Dimensions.get('window').width}
                  source={{html: legalText?.description || ''}}
                  baseStyle={{
                    color: colors.black400,
                    fontSize: 16,
                    lineHeight: 22,
                    fontFamily,
                  }}
                  systemFonts={[fontFamily]}
                />

                {/* <View style={[l.mt20]}>
                  <Button theme={'primary'} title={'Close'} onPress={goBack} />
                </View> */}
              </View>
            ) : null}
          </ScrollView>
        </View>
      )}
    </>
  );
};

export default LegalTextDetail;
