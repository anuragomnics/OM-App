import {RouteProp} from '@react-navigation/core';
import React, {FC} from 'react';
import {View} from 'react-native';
import RNGallery from 'react-native-image-gallery';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

// custom
import Header from '../../components/Header';
import Text from '../../components/Text';
import {RootStackParams, ScreenID} from '../../navigation/types';
import {ContainerStyles} from '../../styles/elements';

interface Props {
  route: RouteProp<RootStackParams, ScreenID.FullScreenImage>;
}

const FullScreenImage: FC<Props> = ({route}) => {
  const {bottom, top} = useSafeAreaInsets(); // @ts-ignore
  const {imageUrl = ''} = route.params;
  console.log('imageUrlimageUrlimageUrl', imageUrl);
  return (
    <View style={[ContainerStyles]}>
      <View
        style={[
          {
            backgroundColor: 'white',
            position: 'absolute',
            zIndex: 9,
            width: '100%',
            height: '100%',
          },
        ]}>
        <View style={{zIndex: 999}}>
          <Header useBack title={' '} />
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
