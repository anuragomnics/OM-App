import React, {FC, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
// styles
import {c, t, f, l} from '../../styles/shared';
// custom
import {usePrimaryStyles} from '../../hooks/useThemeStyles';
import Text from '../Text';

interface Props {
  onValueChange: (value: boolean) => void;
}

const Checkbox: FC<Props> = ({onValueChange}) => {
  const [value, setvalue] = useState<boolean>(false);
  const {viewStyle} = usePrimaryStyles();

  useEffect(() => {
    onValueChange?.(value);
  }, [value]);

  return (
    <TouchableOpacity
      onPress={() => {
        setvalue(!value);
      }}
      style={[
        styles.container,
        {borderColor: usePrimaryStyles().color},
        value
          ? {...styles.checkboxActive, ...viewStyle}
          : styles.checkboxInactive,
      ]}>
      <Icon color={c.white} size={16} name={'done'} />
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
