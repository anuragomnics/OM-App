import React, {FC} from 'react';
import {Text as RNText, TextProps} from 'react-native';
import {c, t} from '../../styles/shared';
import {findLast} from 'lodash';
import {useFontStyle} from '../../components/AppFonts';

function lineHeight(fontSize: number) {
  const multiplier = fontSize > 20 ? 0.5 : 0.2;
  return fontSize + fontSize * multiplier;
}

const Text: FC<TextProps> = ({children, style, ...rest}) => {
  const textStyle = (Array.isArray(style) ? style : [style]).filter(v => !!v);
  const fontSizeStyle: any = findLast(textStyle, (v: any) => v.fontSize) || {};
  const fontStyle = useFontStyle(textStyle);

  return (
    <RNText
      {...rest}
      textBreakStrategy={'simple'}
      allowFontScaling={false}
      style={[
        {color: c.black400},
        // {lineHeight: lineHeight(fontSizeStyle?.fontSize || t.p.fontSize)},
        textStyle,
        // @ts-ignore
        fontStyle,
        {
          fontSize: fontSizeStyle?.fontSize || t.p.fontSize,
        },
      ]}>
      {children}
    </RNText>
  );
};

export default Text;
