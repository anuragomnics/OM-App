import {useAppSelector} from './useRedux';
import {
  ColorSelector,
  FontSelector,
  ThemeSelector,
} from '../store/Configuration/Selectors';
import {StyleSheet} from 'react-native';

export const usePrimaryStyles = () => {
  const colors = useAppSelector(ColorSelector());
  return {
    viewStyle: {backgroundColor: colors?.color_accent},
    textStyle: {color: colors?.color_accent},
    color: colors?.color_accent,
  };
};

export const useAccentStyles = () => {
  const colors = useAppSelector(ColorSelector());

  return {
    accentViewStyle: {backgroundColor: colors?.color_accent_text_color},
    accentTextStyle: {color: colors?.color_accent_text_color},
    accentColor: colors?.color_accent_text_color,
  };
};
