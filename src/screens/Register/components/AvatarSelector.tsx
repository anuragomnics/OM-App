import React, {FC, useState} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
} from 'react-native-image-picker';
import to from 'await-to-js';
// styles
import {c, l} from '../../../styles/shared';
// custom
import AvatarComponent from '../../../components/Avatar';
import {useBottomAction} from '../../../hooks/useBottomAction';
import ImagePickerUtil from '../../../utils/ImagePickerUtil';

const ProfileImageSelect: FC<any> = () => {
  const {showBottomSheet} = useBottomAction();
  const [URI, setURI] = useState<string>('');
  let error, data;
  const handleAvatarSelect = () => {
    showBottomSheet(
      {
        options: ['Take a photo', 'Open gallery'],
      },
      async selectedIndex => {
        if (selectedIndex === 0) {
          [error, data] = await to<ImagePickerResponse>(
            ImagePickerUtil(launchCamera, {
              mediaType: 'photo',
              cameraType: 'front',
            }),
          );
        } else {
          [error, data] = await to<ImagePickerResponse>(
            ImagePickerUtil(launchImageLibrary, {
              mediaType: 'photo',
              cameraType: 'front',
            }),
          );
        }

        if (error) {
          setURI('');
        } else {
          const uri = data?.assets?.[0].uri;
          // @ts-ignore
          setURI(uri);
        }
      },
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleAvatarSelect}
        style={styles.avatarContainer}
        activeOpacity={0.7}>
        {URI ? (
          <Image
            resizeMode={'cover'}
            style={styles.avatar}
            source={{uri: URI}}
          />
        ) : (
          <Icon color={c.black400} size={50} name={'photo-camera'} />
        )}
      </TouchableOpacity>

      {/* <TouchableOpacity onPress={handleAvatarSelect}>
        <Text style={[l.mt5]}>change profile photo</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    ...l.mb20,
  },
  avatarContainer: {
    backgroundColor: c.grey50,
    height: 100,
    width: 100,
    ...l.flexCenter,
    borderRadius: 50,
    overflow: 'hidden',
  },
  avatar: {
    height: '100%',
    width: '100%',
  },
});

export default ProfileImageSelect;
