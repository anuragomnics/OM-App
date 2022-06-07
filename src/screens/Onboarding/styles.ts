import {StyleSheet} from 'react-native';

// custom
import {t, f, l, c} from '../../styles/shared';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  bannerImagecontainer: {
    height: '40%',
    ...l.pb20,
  },
  bannerImg: {
    height: '100%',
    width: '100%',
  },
  bodyContainer: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...l.pb30,
  },
  pagerContainer: {
    flex: 1,
  },
  pagerItemContainer: {
    ...l.p20,
    alignItems: 'center',
  },
  pagerItemWrapper: {},
  pagerItemTitle: {
    ...t.h3,
    ...f.fontWeightBold,
    color: c.white,
    textAlign: 'center',
  },
  pagerItemDescription: {
    color: c.white,
    textAlign: 'center',
    ...l.mt20,
    lineHeight: 20,
  },
  dotsContainer: {
    ...l.flexRow,
    ...l.justifyCtr,
  },
  dotStyle: {
    backgroundColor: c.white,
    width: 10,
    height: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  signinBtnContainer: {
    ...l.m20,
  },
  signinBtn: {
    width: '100%',
  },
});
