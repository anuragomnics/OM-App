import React, {FC} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {ScreenID} from '../../navigation/types';
import NavigationService from '../../services/NavigationService';
// styles
import {c, t, f, l} from '../../styles/shared';
// custom
import Checkbox from '../FormControls/Checkbox';
import Text from '../Text';

interface Props {
  title: string;
  content: string;
  onValueChange: (value: boolean) => void;
  error?: boolean;
  touched?: boolean;
}

const TermsAndPolicy: FC<Props> = ({
  title,
  content,
  onValueChange,
  touched,
  error,
}) => {
  const goToLawTextDetail = () => {
    NavigationService.pushToScreen(ScreenID.LawTextDetail, {content});
  };

  const hasError = touched && error;

  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        <Checkbox onValueChange={onValueChange} />
        <Text style={styles.title}>
          {title}{' '}
          <Text
            onPress={goToLawTextDetail}
            style={styles.moreInfo}>{`(mehr erfahren...)`}</Text>
        </Text>
      </View>
      {hasError && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...l.mt15,
  },
  bodyContainer: {
    flexDirection: 'row',
  },
  title: {
    flex: 1,
    flexWrap: 'wrap',
    ...l.ml10,
  },
  moreInfo: {
    ...t.pSM,
    ...l.mt5,
    textAlign: 'center',
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
  },
  error: {
    ...t.pSM,
    color: c.red800,
    textAlign: 'center',
    marginTop: 5,
  },
});

export default TermsAndPolicy;
