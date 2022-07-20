import React, {FC, useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
// styles
import {c, t, f, l} from '../../styles/shared';
// custom
import {usePrimaryStyles} from '../../hooks/useThemeStyles';
import Text from '../Text';

interface Props {
  onValueChange: (value: boolean) => void;
  checked?: boolean;
}

const Checkbox: FC<Props> = ({onValueChange, checked}) => {
  const {viewStyle} = usePrimaryStyles();

  return (
    <TouchableOpacity
      onPress={() => {
        // setvalue(!value);
        onValueChange?.(!checked);
      }}
      style={[
        styles.container,
        {borderColor: usePrimaryStyles().color},
        checked
          ? {...styles.checkboxActive, ...viewStyle}
          : styles.checkboxInactive,
      ]}>
      {checked ? <Icon color={c.white} size={16} name={'done'} /> : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 20,
    height: 20,
    ...l.flexCenter,
    borderRadius: 5,
    borderWidth: 2,
  },
  checkboxActive: {},
  checkboxInactive: {},
});

export default Checkbox;
