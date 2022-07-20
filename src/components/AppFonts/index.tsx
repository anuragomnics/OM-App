import React, {FC, useEffect, useMemo, useCallback} from 'react';
import {Platform, View} from 'react-native';
import {findLast} from 'lodash';
// styles
import {f} from '../../styles/shared';
//custom
import {
  useAppDispatch,
  useAppSelector,
  useThunkCallbackAction,
} from '../../hooks/useRedux';
import {
  fetchLoadAppFonts,
  FontSelector,
  FontsSelector,
  LoadAppFontsPrefix,
} from '../../store/Configuration';
import {FontType} from '../../types/request';

interface Props {
  onError: () => void;
  onSuccess: () => void;
}

const AppFonts: FC<Props> = ({onSuccess, onError}) => {
  const fontName = useAppSelector(FontSelector());
  const dispatch = useAppDispatch();

  const onLoadFontsSuccess = useCallback(() => {
    onSuccess();
  }, [onSuccess]);

  const onLoadFontsError = useCallback(() => {
    onError();
  }, [onError]);

  useEffect(() => {
    if (!fontName) {
      return;
    }
    //@ts-ignore
    dispatch(fetchLoadAppFonts({fontName: fontName}));
  }, [fontName]);

  useThunkCallbackAction(
    LoadAppFontsPrefix,
    () => {
      onLoadFontsSuccess();
    },
    () => {
      onLoadFontsError();
    },
  );

  return <View />;
};

export const useFontFamily = () => {
  const fontFamily = useAppSelector(FontSelector());
  const fonts = useAppSelector(FontsSelector());

  if (Platform.OS === 'ios') {
    return fontFamily;
  }
  let fontWeight = '400';
  return `${fontFamily}_${fontWeight}`;
};

export const useFontStyle = (styles?: Array<any>) => {
  const fontFamily = useAppSelector(FontSelector());
  const fonts = useAppSelector(FontsSelector());

  return useMemo(() => {
    const weight = fonts && fonts.map((v: FontType) => v.fontWeight.toString());
    let fontWeight = '400';
    let isFontSupport = false;
    if (styles) {
      const fontWeightStyle: any =
        findLast(styles, (v: any) => v.fontWeight) || {};
      const currentWeight = weight.find(
        (v: any) => v === fontWeightStyle.fontWeight,
      );

      fontWeight = currentWeight ? currentWeight.toString() : '400';
      isFontSupport = !!currentWeight;
    }

    if (Platform.OS === 'ios') {
      return {
        fontWeight: fontWeight,
        fontFamily,
      };
    }

    if (isFontSupport) {
      return {
        fontFamily: `${fontFamily}_${fontWeight}`,
      };
    }

    return {
      fontFamily: `${fontFamily}_${fontWeight}`,
      fontWeight,
    };
  }, [fontFamily, fonts, styles]);
};

export default AppFonts;
