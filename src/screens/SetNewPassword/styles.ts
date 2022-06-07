import {StyleSheet} from 'react-native';

// custom
import {t, f, l, c} from '../../styles/shared';

export default StyleSheet.create({
  wrapper: {
    ...l.mx20,
    // ...l.mt20,
  },
  bannerImage: {
    width: '100%',
    height: 220,
    // borderRadius: 5,
  },
  welcomeBack: {
    ...t.h3,
    ...f.fontWeightBold,
    ...l.mt15,
  },

  FormContainerWidgetContainer: {
    ...l.p20,
  },
});
