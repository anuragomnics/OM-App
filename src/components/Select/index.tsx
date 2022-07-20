import React, {FC, useState} from 'react';
import {View, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useBottomAction} from '../../hooks/useBottomAction';
// styles
import {c, t, f, l} from '../../styles/shared';
// custom
import Text from '../../components/Text';
import {useFontStyle} from '../AppFonts';
import Input from '../FormControls/Input';

interface Props {
  options: Array<{id: number; name: string}>;
  onSelect: (index: string) => void;
  value: string | undefined;
  placeholder: string;
  error?: string;
  touched?: boolean;
}

const Select: FC<Props> = ({
  options = [],
  onSelect,
  value,
  placeholder,
  error,
  touched,
}) => {
  const {showBottomSheet} = useBottomAction();
  const onPress = () => {
    const optionsStrArr = options.map(v => {
      return v.name;
    });
    showBottomSheet(
      {options: optionsStrArr},
      buttonIndex => {
        onSelect?.(options[buttonIndex].name);
        setTouched(true);
      },
      // cancel callback
      () => {
        setTouched(true);
      },
    );
  };
  const [touched1, setTouched] = useState(false);
  const hasError = touched && error;
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.wrapper, {borderColor: hasError ? c.red800 : '#a8afb5'}]}
        onPress={onPress}
        activeOpacity={0.5}>
        <TextInput
          editable={false}
          enabled={false}
          style={[
            //@ts-ignore
            useFontStyle(),
            styles.value,
            {color: c.black400},
          ]}
          value={value}
          placeholder={placeholder}
        />

        <Icon size={25} name={'arrow-drop-down'} />
      </TouchableOpacity>
      {hasError && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...l.mb15,
  },
  wrapper: {
    ...l.flexRow,
    ...l.alignCtr,
    borderWidth: 1,
    ...l.defaultBorderRadius,
    height: 50,
  },
  value: {
    ...t.p,
    ...l.px15,
    flex: 1,
  },
  dropdownIcon: {
    position: 'absolute',
    right: 0,
  },
  error: {
    ...t.pSM,
    color: c.red800,
    textAlign: 'center',
    marginTop: 5,
  },
});

export default Select;
