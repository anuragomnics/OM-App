import React, {FC} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';

// custom
import {c, t, f, l} from '../../../../styles/shared';
import Text from '../../../../components/Text';

interface Props {
  description: string;
  imageUrl: string;
}

const MembershipDetails: FC<Props> = ({description, imageUrl}) => {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <FastImage style={styles.membershipImg} source={{uri: imageUrl}} />
        <Text numberOfLines={5} style={[styles.description]}>
          {description ? description : 'No description available at the moment'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...l.mx20,
    ...l.mt20,
    ...l.flexCenter,
  },
  wrapper: {
    backgroundColor: c.white,
    ...l.fullWidth,
    ...l.p20,
    ...l.flexRow,
    ...l.flexCenter,
    ...l.defaultBorderRadius,
  },
  membershipImg: {
    flex: 1,
    minHeight: 20,
    ...l.fullWidth,
    height: 100,
  },
  description: {
    flex: 2,
    flexWrap: 'wrap',
    ...l.ml10,
  },
});

export default MembershipDetails;
