import React, {FC} from 'react';
import {View, Text} from 'react-native';
import {Flow} from 'react-native-animated-spinkit';
import {usePrimaryStyles} from '../hooks/useThemeStyles';
// custom
import {l} from '../styles/shared';

interface Props {
  position?: 'top' | 'center';
}

const SpinnerLoader: FC<Props> = ({position = 'top'}) => {
  const {color} = usePrimaryStyles();
  return (
    <View
      style={[
        l.flex,
        l.alignCtr,
        position === 'center' ? {...l.justifyCtr} : {},
      ]}>
      <Flow
        size={45}
        color={color}
        style={[position === 'top' ? {marginTop: 200} : {}]}
      />
    </View>
  );
};

export default SpinnerLoader;
