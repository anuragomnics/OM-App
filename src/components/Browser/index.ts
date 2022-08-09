import {Linking, Alert} from 'react-native';

export const openLink = async (url: string) => {
  try {
    Linking.openURL(url);
  } catch (error) {}
};
