type fontWeightType = '300' | '400' | '500' | '600' | '700' | '800' | '900';
const fontWeightLight: fontWeightType = '300';
const fontWeightNormal: fontWeightType = '400';
const fontWeightMedium: fontWeightType = '500';
const fontWeightBold: fontWeightType = '900';

export const fonts = {
  RobotoBold: {fontFamily: 'Roboto-Bold'},
  RobotoMedium: {fontFamily: 'Roboto-Medium'},
  RobotoRegular: {fontFamily: 'Roboto-Regular'},
  RobotoLight: {fontFamily: 'Roboto-Light'},
  RobotoBlack: {fontFamily: 'Roboto-Black'},
  fontWeightLight: {fontWeight: fontWeightLight},
  fontWeightNormal: {fontWeight: fontWeightNormal},
  fontWeightMedium: {fontWeight: fontWeightMedium},
  fontWeightBold: {fontWeight: fontWeightBold},
};

export const typography = {
  bold: {
    fontWeight: '700' as const,
  },
  h1: {
    fontSize: 32,
  },
  h2: {
    fontSize: 26,
  },
  h2SM: {
    fontSize: 22,
  },
  h3: {
    fontSize: 20,
  },
  h4: {
    fontSize: 18,
  },
  h4SM: {
    fontSize: 17,
  },
  h5: {
    fontSize: 16,
  },
  h5SM: {
    fontSize: 15,
  },
  p: {
    fontSize: 14,
  },
  pSM: {
    fontSize: 12,
  },
  pXS: {
    fontSize: 10,
  },
  pXXS: {
    fontSize: 8,
  },
  lh18: {
    lineHeight: 18,
  },
  lh20: {
    lineHeight: 20,
  },
};
