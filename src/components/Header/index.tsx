import React, {ReactElement} from 'react';
import {View, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BoxShadowStyles} from '../../styles/elements';
import Icon from 'react-native-vector-icons/MaterialIcons';

// images
import BackIcon from '../../assets/images/back.png';
import BackWhiteIcon from '../../assets/images/backWhite.png';

// custom
import Text from '../../components/Text';
import NavigationService from '../../services/NavigationService';
import {t, f, l} from '../../styles/shared';
import {useAppSelector} from '../../hooks/useRedux';
import {SettingsSelector, ThemeSelector} from '../../store/Configuration';
import {useColors} from '../../styles/shared/Colors';
import FastImage from 'react-native-fast-image';

interface Props {
  title?: string;
  useLogo?: boolean;
  useBack?: boolean;
  useDrawer?: boolean;
  rightIcon?: {iconName: string; iconColor?: string};
  onLeftIconPress?: () => void;
  leftIcon?: {iconName: string; iconColor?: string};
  onRightIconPress?: () => void;
  onBackPress?: () => void;
  defaultPageLogo?: boolean;
}

const IconSize = 25;

const Header: React.FC<Props> = ({
  title,
  useLogo,
  useBack,
  onBackPress,
  useDrawer,
  leftIcon,
  onLeftIconPress,
  rightIcon,
  onRightIconPress,
  defaultPageLogo,
}) => {
  const appTheme = useAppSelector(ThemeSelector());
  const colors = useColors();
  const settings = useAppSelector(SettingsSelector());

  const {top} = useSafeAreaInsets();
  const goBack = () => {
    NavigationService.goBack();
  };

  const openDrawer = () => {
    NavigationService.openDrawer();
  };

  const defaultPage_image_url =
    appTheme === 'dark'
      ? settings.main_logo_monochrome_url
      : settings.main_logo_url;

  const renderLeft = () => {
    if (useBack) {
      return (
        <TouchableOpacity
          style={[styles.backContainer]}
          onPress={() => {
            onBackPress ? onBackPress?.() : goBack();
          }}
          activeOpacity={0.7}>
          <Image
            source={appTheme === 'light' ? BackIcon : BackWhiteIcon}
            style={styles.backIcon}
          />
        </TouchableOpacity>
      );
    }

    if (defaultPageLogo) {
      return (
        <View style={[l.flexRow, l.alignCtr]}>
          <FastImage
            source={{uri: defaultPage_image_url || ''}}
            style={styles.headerLogoImg}
            // resizeMode={FastImage.resizeMode.cover}
          />
        </View>
      );
    }

    if (leftIcon) {
      return (
        <TouchableOpacity
          onPress={() => {
            onLeftIconPress?.();
          }}>
          <Icon
            size={IconSize}
            name={leftIcon.iconName}
            color={leftIcon.iconColor}
          />
        </TouchableOpacity>
      );
    }

    // return <View style={{width: IconSize}} />;
  };

  const renderRight = () => {
    if (useDrawer) {
      return (
        <TouchableOpacity style={[{}]} onPress={openDrawer} activeOpacity={0.7}>
          <Icon size={IconSize} color={colors.black400} name={'menu'} />
        </TouchableOpacity>
      );
    }

    if (rightIcon) {
      return (
        <TouchableOpacity
          onPress={() => {
            onRightIconPress?.();
          }}>
          <Icon
            size={IconSize}
            name={rightIcon.iconName}
            color={rightIcon.iconColor}
          />
        </TouchableOpacity>
      );
    }
  };

  return (
    <View
      style={[
        styles.container,
        // BoxShadowStyles,
        {
          paddingTop: useLogo ? top : top + 20,
          paddingBottom: useLogo ? 5 : 20,
          borderBottomColor:
            appTheme === 'light' ? colors.grey400 : colors.grey1000,
        },
      ]}>
      {renderLeft()}

      <View style={[l.flex, l.alignCtr, l.justifyCtr]}>
        {useLogo && (
          <Image
            source={require('../../assets/images/app_logo.png')}
            style={styles.headerLogoImg}
            resizeMode={'contain'}
          />
        )}

        {title && !defaultPageLogo ? (
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        ) : null}
      </View>

      {renderRight()}

      {/* {rightIcon && (
        <TouchableOpacity
          onPress={() => {
            onRightIconPress?.();
          }}>
          <Icon
            size={IconSize}
            name={rightIcon.iconName}
            color={rightIcon.iconColor}
          />
        </TouchableOpacity>
      )} */}
      {/* {!rightIcon && <View style={{width: IconSize}} />} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...l.px20,
    ...l.pb20,
    ...l.flexRow,
    ...l.alignCtr,
    minHeight: 80,
    borderBottomWidth: 0.5,
  },
  backContainer: {
    width: IconSize + 10,
    ...l.py5,
    // borderWidth: 1,
  },
  backIcon: {
    width: 25,
    height: 15,
  },
  headerLogoContainer: {
    flex: 1,
    ...l.flexCenter,
  },
  headerLogoImg: {
    height: 40,
    width: 120,
    // ...l.mb5,
  },
  title: {
    ...t.h3,
    ...f.fontWeightMedium,
    ...l.fullWidth,
    ...l.mx10,
    ...l.ml20,
  },
});

export default React.memo(Header);
