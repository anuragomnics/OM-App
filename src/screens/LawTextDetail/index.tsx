import React, {FC} from 'react';
import {Dimensions, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Button from '../../components/Button';
import AutoHeightWebView from 'react-native-autoheight-webview';

// custom
import Header from '../../components/Header';
import NavigationService from '../../services/NavigationService';
import {ContainerStyles} from '../../styles/elements';
import {l} from '../../styles/shared';
import Text from '../../components/Text';
import {RouteProp} from '@react-navigation/core';
import {RootStackParams, ScreenID} from '../../navigation/types';

interface Props {
  route: RouteProp<RootStackParams, ScreenID.LawTextDetail>;
}

const LawTextDetail: FC<Props> = ({route}) => {
  // @ts-ignore
  const {content} = route.params;

  const goBack = () => {
    NavigationService.goBack();
  };

  return (
    <View style={[ContainerStyles]}>
      <Header rightIcon={{iconName: 'close'}} onRightIconPress={goBack} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        style={[l.p20]}>
        {content && (
          <View style={[l.mb30]}>
            {/* content */}
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
              source={{html: content}}
              scalesPageToFit={false}
              scrollEnabled={false}
              androidLayerType={'hardware'}
            />
            <View style={[l.mt20]}>
              <Button theme={'primary'} title={'Close'} onPress={goBack} />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default LawTextDetail;
