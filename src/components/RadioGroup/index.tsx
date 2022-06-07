import React, {FC, useEffect, useState} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {c, t, f, l} from '../../styles/shared';
// custom
import Text from '../../components/Text';
import {usePrimaryStyles} from '../../hooks/useThemeStyles';

interface option {
  value: string;
  title: string;
}
interface Props {
  options: option[];
  onSelect?: (option: option) => void;
}

interface RadioCircleProps {
  checked: boolean;
}

const RadioCircle: FC<RadioCircleProps> = ({checked}) => {
  const {color} = usePrimaryStyles();
  return (
    <View style={[styles.circleContainer, {borderColor: color}]}>
      {checked && <View style={[styles.circle, {backgroundColor: color}]} />}
    </View>
  );
};

const Radiogroup: FC<Props> = ({options, onSelect}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const onPress = (index: number) => {
    setSelectedIndex(index);
    onSelect?.(options[index]);
  };

  useEffect(() => {
    onSelect?.(options[selectedIndex]);
  }, []);

  return (
    <View>
      {options.map((option, index) => {
        return (
          <TouchableOpacity
            activeOpacity={0.7}
            key={index}
            style={styles.radioOptionContainer}
            onPress={() => {
              onPress(index);
            }}>
            <RadioCircle checked={Boolean(selectedIndex === index)} />
            <Text style={[styles.option]}>{option.title}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  circleContainer: {
    height: 20,
    width: 20,
    borderWidth: 1.5,
    borderRadius: 25,
    ...l.flexCenter,
  },
  circle: {
    height: 10,
    width: 10,
    borderRadius: 20,
  },
  radioOptionContainer: {
    ...l.mt10,
    ...l.px15,
    height: 50,
    ...l.flexRow,
    ...l.alignCtr,
    ...l.defaultBorderRadius,
    borderWidth: 1,
    borderColor: '#a8afb5',
  },
  option: {
    ...l.ml10,
  },
});

export default Radiogroup;
