import React, {FC} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {l, t, c} from '../../styles/shared';
import {ChapterType} from '../../types/responses/SingleCourseResponseType';
import Icon from 'react-native-vector-icons/MaterialIcons';

// custom
import Text from '../Text';
import {usePrimaryStyles} from '../../hooks/useThemeStyles';

interface Props {
  item: ChapterType;
  isPlaying: boolean;
}

const ChapterItem: FC<Props> = ({item, isPlaying}) => {
  const primaryColor = usePrimaryStyles().color;

  return (
    <TouchableOpacity
      disabled={!item.watch_duration_total || isPlaying}
      style={[l.flexRow]}>
      {item.title_image ? (
        <FastImage
          source={{
            uri: item.title_image,
          }}
          style={styles.chapterBannerImg}
          resizeMode={FastImage.resizeMode.stretch}
        />
      ) : (
        <Icon name={'slideshow'} size={40} color={c.black200} />
      )}

      <View style={[l.flexRow, l.flex, l.alignCtr]}>
        <View style={[l.mx10, l.flex]}>
          <Text style={[t.h5]}>{item.title}</Text>
          <View style={[l.flexRow, l.alignCtr, l.mt5]}>
            <Text style={[{color: primaryColor}, t.pSM]}>
              {item.watch_duration_total} Mins
            </Text>
          </View>
        </View>
        <View>
          <Icon
            name={isPlaying ? 'pause' : 'play-circle-filled'}
            size={30}
            color={item.watch_duration_total ? primaryColor : c.grey100}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chapterBannerImg: {
    height: 40,
    width: 40,
    ...l.defaultBorderRadius,
  },
});

export default ChapterItem;
