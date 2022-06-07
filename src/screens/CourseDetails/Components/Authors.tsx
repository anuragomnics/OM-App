import React, {FC} from 'react';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialIcons';

// custom
import Text from '../../../components/Text';
import DeviceHelper from '../../../config/DeviceHelper';
import {f, l, t} from '../../../styles/shared';
import {SingleNewsType} from '../../../types/responses/SingleNewsResposeType';

interface Props {
  news: SingleNewsType | undefined;
}

const contentWidth = DeviceHelper.width - 40;
const imageWidth = contentWidth / 3 - 20;

const Authors: FC<Props> = ({news}) => {
  return (
    <View>
      {/* {(!news?.authors || news?.authors.length === 0) && (
        <View>
          <Text style={[t.h5]}>{'There are no authors for this news.'}</Text>
        </View>
      )} */}

      <View style={[l.flexRow, l.justifyCtr, l.wrap]}>
        {news?.authors.map((author, index) => {
          return (
            <View
              key={index}
              style={[
                l.alignCtr,
                {width: imageWidth},
                index > 3 ? l.mt30 : l.mt20,
                index > 0 ? l.ml20 : {},
              ]}>
              {author.primary_image ? (
                <FastImage
                  source={{uri: author.primary_image}}
                  style={[
                    {
                      height: imageWidth,
                      width: imageWidth,
                      borderRadius: imageWidth,
                    },
                  ]}
                />
              ) : (
                <Icon name={'person-outline'} size={imageWidth} />
              )}
              <Text
                style={[
                  t.h5,
                  f.fontWeightMedium,
                  l.mt10,
                  {textAlign: 'center'},
                ]}>
                {author.name}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default Authors;
