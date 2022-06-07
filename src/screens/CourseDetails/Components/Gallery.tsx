import React, {FC} from 'react';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import Text from '../../../components/Text';
import DeviceHelper from '../../../config/DeviceHelper';

// custom
import {l, t} from '../../../styles/shared';
import {SingleNewsType} from '../../../types/responses/SingleNewsResposeType';

interface Props {
  news: SingleNewsType | undefined;
}

const deviceWidth = DeviceHelper.width;
const imageWidth = (deviceWidth - 40) / 2 - 10 / 2;

const Gallery: FC<Props> = ({news}) => {
  return (
    <View style={[l.flexRow, l.wrap, l.justifyBtw]}>
      {/* {(!news?.gallery || news?.gallery.length === 0) && (
        <View>
          <Text style={[t.h5]}>{'There is no gallery for this news.'}</Text>
        </View>
      )} */}
      {news?.gallery.map((item, index) => {
        return (
          <FastImage
            key={index}
            source={{uri: item.url}}
            style={[
              {height: 200, width: imageWidth},
              l.defaultBorderRadius,
              index > 1 ? l.mt10 : {},
            ]}
          />
        );
      })}
    </View>
  );
};

export default Gallery;
