import React, {FC, useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {
  Circle,
  CircleFade,
  Swing,
  Wave,
  Flow,
} from 'react-native-animated-spinkit';
import {usePrimaryStyles} from '../hooks/useThemeStyles';
// custom
import {l} from '../styles/shared';

interface Props {
  position?: 'top' | 'inline';
}

const SpinnerLoader: FC<Props> = ({position = 'top'}) => {
  const {color} = usePrimaryStyles();
  return (
    <View style={[l.flex, l.alignCtr]}>
      <Flow
        size={40}
        color={color}
        style={[position === 'top' ? {marginTop: 200} : {}]}
      />
    </View>
  );
};

export const AudioPlayingLoader = () => {
  const {color} = usePrimaryStyles();

  return (
    <>
      <Wave size={45} color={color} animating />
    </>
  );
};

export default SpinnerLoader;
