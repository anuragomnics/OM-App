import {StyleSheet} from 'react-native';

// custom
import {t, f, l, c} from '../../styles/shared';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.grey50,
  },
  bodyWrapper: {
    ...l.px20,
  },
  contentContainerStyle: {
    ...l.pb40,
  },
  bannerImg: {
    width: '100%',
    height: 220,
  },
  signInDesc: {
    textAlign: 'center',
    ...l.mt20,
    ...l.mb10,
  },
  productMembershipHeader: {
    textAlign: 'center',
    ...l.mt30,
    ...l.mb10,
    // ...t.h5,
  },
  linkText: {
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
  },
});
