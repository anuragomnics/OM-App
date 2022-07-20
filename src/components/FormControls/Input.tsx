import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  TextInput,
  Image,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useAppSelector} from '../../hooks/useRedux';
import {ThemeSelector} from '../../store/Configuration';

// custom
import {t, f, l, c} from '../../styles/shared';
import {useColors} from '../../styles/shared/Colors';
import {useFontStyle} from '../AppFonts';
import Text from '../Text';

interface Props extends TextInputProps {
  widgetStyles?: {
    container?: StyleProp<ViewStyle>;
    wrapper?: StyleProp<ViewStyle>;
    input?: StyleProp<ViewStyle>;
  };
  touched?: boolean;
  error?: string;
  hideError?: boolean;
  leftIcon?: {iconName: string; iconColor?: string};
  rightIcon?: {iconName: string; iconColor?: string};
  onRightIconPress?: () => void;
  type?: 'search';
  onClearSearch?: () => void;
  secureTextEntry?: boolean;
}

const Input: React.FC<Props> = ({
  widgetStyles,
  touched,
  error,
  hideError,
  leftIcon,
  rightIcon,
  type,
  onClearSearch,
  secureTextEntry,
  onRightIconPress,
  ...rest
}) => {
  const hasError = touched && error;
  const fontStyles = useFontStyle();
  const appTheme = useAppSelector(ThemeSelector());
  const colors = useColors();

  const clearSearch = () => {
    // @ts-ignore
    rest?.onChangeText('');
    onClearSearch?.();
  };

  // refs
  const inputRef = useRef<TextInput>(null);
  // state
  const [borderColor, setBorderColor] = useState(c.black100);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (secureTextEntry && inputRef) {
      inputRef.current?.setNativeProps({
        style: fontStyles,
      });
    }
  }, [fontStyles, secureTextEntry]);

  return (
    <View style={[styles.container, widgetStyles?.container]}>
      <View
        style={[
          styles.wrapper,
          {
            borderColor: hasError ? c.red800 : borderColor,
            backgroundColor: appTheme === 'light' ? '#f5f5f5' : '#212121',
          },
          widgetStyles?.wrapper,
        ]}>
        {leftIcon && (
          <View style={styles.iconWrapper}>
            <Icon
              name={leftIcon.iconName}
              size={20}
              color={leftIcon.iconColor || colors.black400}
            />
          </View>
        )}
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            {color: colors.black400},
            // @ts-ignore
            fontStyles,
            widgetStyles?.input,
          ]}
          onFocus={() => {
            setBorderColor(c.black200);
            setIsFocused(true);
          }}
          onBlur={() => {
            setBorderColor(c.black100);
            setIsFocused(false);
          }}
          secureTextEntry={secureTextEntry}
          placeholderTextColor={c.black200}
          {...rest}
        />
        {rightIcon && (
          <TouchableOpacity
            style={styles.rightIconWrapper}
            onPress={() => {
              onRightIconPress?.();
            }}>
            <Icon
              name={rightIcon.iconName}
              size={20}
              color={rightIcon.iconColor || c.black400}
            />
          </TouchableOpacity>
        )}
        {type === 'search' && rest?.value ? (
          <TouchableOpacity
            style={styles.clearSearchContainer}
            onPress={clearSearch}>
            <Icon name={'close'} size={14} color={c.black400} />
          </TouchableOpacity>
        ) : null}
      </View>
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
  iconWrapper: {
    ...l.pl10,
  },
  rightIconWrapper: {
    ...l.pr10,
  },
  input: {
    ...t.p,

    ...l.px15,
    flex: 1,
  },
  clearSearchContainer: {
    backgroundColor: '#ebebeb',
    ...l.p5,
    ...l.justifyCtr,
    ...l.alignCtr,
    borderRadius: 20,
    ...l.mx10,
  },
  error: {
    ...t.pSM,
    color: c.red800,
    textAlign: 'center',
    marginTop: 5,
  },
});

export default React.memo(Input);
