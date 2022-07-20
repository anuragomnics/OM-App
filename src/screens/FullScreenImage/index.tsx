import {RouteProp} from '@react-navigation/core';
import React, {FC} from 'react';
import {View} from 'react-native';
import RNGallery from 'react-native-image-gallery';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

// custom
import Header from '../../components/Header';
import Text from '../../components/Text';
import {RootStackParams, ScreenID} from '../../navigation/types';
import {useContainerStyles} from '../../styles/elements';

interface Props {
  route: RouteProp<RootStackParams, ScreenID.FullScreenImage>;
}

const FullScreenImage: FC<Props> = ({route}) => {
  const {bottom, top} = useSafeAreaInsets();
  const ContainerStyles = useContainerStyles();
  // @ts-ignore
  const {imageUrl = ''} = route.params;
  return (
    <View style={[ContainerStyles]}>
      <View
        style={[
          {
            position: 'absolute',
            zIndex: 9,
            width: '100%',
            height: '100%',
          },
        ]}>
        <View style={{zIndex: 999}}>
          <Header useBack />
        </View>
        <RNGallery
          scrollViewStyle={
            {
              // width: '100%',
              // height: '100%',
              // bottom: bottom + 100,
            }
          }
          images={[{source: {uri: imageUrl}}]}
        />
      </View>
    </View>
  );
};

export default FullScreenImage;
