import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Dimensions} from 'react-native';

// custom
import Text from '../../../components/Text';
import {f, l, t} from '../../../styles/shared';
import {SingleEventType} from '../../../types/responses/SingleEventResponseType';

interface Props {
  event: SingleEventType | undefined;
}

const win = Dimensions.get('window');
const ratio = win.width / 541; //541 is actual image width

const Organizer: FC<Props> = ({event}) => {
  const organizer = event?.organizer;
  return (
    <View style={[l.alignCtr, l.mt20]}>
      <FastImage
        source={{uri: organizer?.image}}
        style={styles.image}
        resizeMode={FastImage.resizeMode.contain}
      />
      <Text style={[t.h4, f.fontWeightMedium, l.mt10]}>{organizer?.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 362 * ratio,
    width: win.width - 40,
  },
});

export default Organizer;
