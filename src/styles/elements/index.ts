import {StyleSheet} from 'react-native';
import {c, f, l, t} from '../shared';

export const ContainerStyles = {
  // backgroundColor: c.grey50,
  backgroundColor: '#f3f5f9',
  flex: 1,
};

export const BoxShadowStyles = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.18,
  shadowRadius: 1.0,
  elevation: 1,
};

export const BoxTopShadowStyles = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: -1,
  },
  shadowOpacity: 0.18,
  shadowRadius: 1.0,
  elevation: 1,
};

export const bodyTextStyles = {
  ...t.p,
  ...f.RobotoRegular,
  color: c.black400,
};

export const WrapperShadowStyles = {
  flex: 1,
  marginTop: 1,
};

export const ListDivider = {
  height: 1.5,
  backgroundColor: c.grey50,
  ...l.my20,
};
