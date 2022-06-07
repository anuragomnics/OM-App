import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import Modal from 'react-native-modal';
import Text from '../../../components/Text';
import {Circle, Flow} from 'react-native-animated-spinkit';

// custom
import {usePrimaryStyles} from '../../../hooks/useThemeStyles';
import {c, l, t} from '../../../styles/shared';

const CreatingAccountModal = () => {
  const primaryColor = usePrimaryStyles().color;
  return (
    <Modal isVisible={true} style={[l.m30]}>
      <View style={[{backgroundColor: c.white}, l.p15, l.defaultBorderRadius]}>
        <Text style={[{textAlign: 'center'}]}>
          Creating your account, Please wait
        </Text>
        <View style={[l.mt15, l.flexRow, l.justifyCtr]}>
          <Flow size={30} color={primaryColor} />
        </View>
      </View>
    </Modal>
  );
};

export default CreatingAccountModal;
