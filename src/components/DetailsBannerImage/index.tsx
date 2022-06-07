import React, {FC} from 'react';
import {
  StatusBar,
  View,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {c, l} from '../../styles/shared';

interface Props {
  imageUrl: string;
  onBackPress: () => void;
  hideBackIcon?: boolean;
}

const DetailsBannerImage: FC<Props> = ({
  imageUrl,
  onBackPress,
  hideBackIcon,
}) => {
  const onPress = () => {
    onBackPress?.();
  };

  return (
    <ImageBackground style={styles.courseBannerImg} source={{uri: imageUrl}}>
      {!hideBackIcon && (
        <TouchableOpacity style={styles.backContainer} onPress={onPress}>
          <Icon
            size={30}
            color={c.black400}
            // name={'keyboard-backspace'}
            name={'chevron-left'}
          />
        </TouchableOpacity>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  courseBannerImg: {
    height: 250,
    ...l.fullWidth,
  },
  backContainer: {
    backgroundColor: c.white,
    height: 30,
    width: 30,
    borderRadius: 40,
    ...l.justifyCtr,
    ...l.alignCtr,
    ...l.ml20,
    ...l.mt50,
  },
});

export default DetailsBannerImage;
