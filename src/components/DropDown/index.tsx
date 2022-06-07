import React, {FC, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  LayoutChangeEvent,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ModalDropdown from 'react-native-modal-dropdown';

// custom
import Text from '../Text';
import {BoxShadowStyles} from '../../styles/elements';
import {c, f, l} from '../../styles/shared';
import {usePrimaryStyles} from '../../hooks/useThemeStyles';

interface Item {
  name: string;
  value: number;
}
interface Props {
  items: Array<Item>;
  onSelectItem: (item: Item) => void;
  defaultIndex: number;
}

const DropDown: FC<Props> = ({items = [], onSelectItem, defaultIndex}) => {
  const {color} = usePrimaryStyles();
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);
  const [dropDownWidth, setDropDownWidth] = useState(250);
  //   let dropDownWidth = 250;

  const onLayout = (e: LayoutChangeEvent) => {
    const {width} = e.nativeEvent.layout;
    if (width !== dropDownWidth) {
      setDropDownWidth(width);
    }
  };

  return (
    <View
      style={[l.flex]}
      onLayout={e => {
        onLayout(e);
      }}>
      <ModalDropdown
        showsVerticalScrollIndicator={false}
        saveScrollPosition={false}
        options={items}
        defaultIndex={defaultIndex}
        dropdownTextHighlightStyle={{backgroundColor: 'red'}}
        // @ts-ignore
        renderRow={(option, index, isSelected) => {
          return (
            <View style={{backgroundColor: c.white}}>
              <Text
                key={index}
                style={[
                  l.p15,
                  l.flex,
                  isSelected ? {color: color, ...f.fontWeightMedium} : {},
                ]}>
                {option.name}
              </Text>
            </View>
          );
        }}
        dropdownStyle={[styles.dropDownStyle, {width: dropDownWidth}]}
        onSelect={(selectedIndex: number) => {
          onSelectItem(items[selectedIndex]);
          setSelectedIndex(selectedIndex);
        }}>
        <View style={styles.dropdown}>
          <View style={[l.flexRow, l.alignCtr]}>
            <Text style={[l.flex]}>{items[selectedIndex]?.name}</Text>
            <Icon name={'arrow-drop-down'} size={20} />
          </View>
        </View>
      </ModalDropdown>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    ...l.flexRow,
    ...l.alignCtr,
    borderWidth: 1,
    ...l.defaultBorderRadius,
    borderColor: '#a8afb5',
    height: 50,
    ...l.px15,
    backgroundColor: c.white,
  },
  dropdownItemsContainer: {
    position: 'absolute',
    backgroundColor: c.white,
    width: '100%',
    top: 50,
    ...BoxShadowStyles,
    borderWidth: 1,
    borderColor: '#a8afb5',
  },
  dropDownStyle: {
    borderWidth: 1,
    borderColor: '#a8afb5',
    height: 150,
    marginTop: Platform.OS === 'android' ? -37 : 0,
    ...l.defaultBorderRadius,
    backgroundColor: '#fff',
  },
  dropdownItem: {
    ...l.p15,
    flex: 1,
    ...l.fullWidth,
  },
});

export default DropDown;
