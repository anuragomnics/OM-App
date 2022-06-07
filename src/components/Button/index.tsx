import React, {FC, useState} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {useAccentStyles, usePrimaryStyles} from '../../hooks/useThemeStyles';
import {Flow} from 'react-native-animated-spinkit';
// styles
import {t, f, l, c} from '../../styles/shared';
// custom
import Text from '../../components/Text';

type ButtonTheme = 'primary' | 'light' | 'simplePrimary' | 'simple';

interface Props {
  title: string;
  theme?: ButtonTheme;
  widgetStyles?: {
    container?: StyleProp<ViewStyle>;
    text?: StyleProp<TextStyle>;
  };
  onPress?: () => void;
  loading?: boolean;
  loadingTitle?: string;
}

const Button: FC<Props> = ({
  title,
  theme,
  widgetStyles,
  onPress,
  loading,
  loadingTitle,
  ...rest
}) => {
  const {viewStyle, textStyle, color} = usePrimaryStyles();
  const {accentTextStyle} = useAccentStyles();

  const [buttonTouched, setButtonTouched] = useState(false);

  const buttonStyles = {
    light: {
      backgroundColor: c.white,
      ...l.px15,
      // ...l.py15,
      minHeight: 50,
      borderRadius: 5,
    },
    simplePrimary: {},
    simple: {},
    primary: {
      ...viewStyle,
      ...l.px15,
      // ...l.py15,
      minHeight: 50,
      borderRadius: 5,
      flexDirection: 'row',
      justifyContent: 'center',
    },
  };

  const buttonTextStyles = {
    primary: {
      color: c.white,
      ...t.p,
      ...f.fontWeightMedium,
      textAlign: 'center',
    },
    simple: {
      ...t.p,
    },
    simplePrimary: {
      ...t.p,
      ...f.fontWeightMedium,
      ...textStyle,
    },
    light: {
      ...textStyle,
      ...t.p,
      ...f.fontWeightMedium,
      textAlign: 'center',
    },
  };

  const buttonStyle: StyleProp<ViewStyle> = theme ? buttonStyles[theme] : {};
  const buttonTextStyle: StyleProp<TextStyle> = theme
    ? buttonTextStyles[theme]
    : {};

  return (
    <TouchableOpacity
      onPressIn={() => {
        setButtonTouched(true);
      }}
      onPressOut={() => {
        setButtonTouched(false);
      }}
      activeOpacity={0.7}
      onPress={onPress}
      style={[buttonStyle, styles.button, widgetStyles?.container]}
      disabled={loading}
      {...rest}>
      <Text
        style={[
          buttonTextStyle,
          buttonTouched ? accentTextStyle : null,
          widgetStyles?.text,
        ]}>
        {loading ? loadingTitle : title}
      </Text>
      {loading && <Flow size={45} color={c.white} style={[l.ml5]} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Button;
