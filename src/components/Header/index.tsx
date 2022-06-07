import React, {ReactElement} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BoxShadowStyles} from '../../styles/elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
// styles
import {t, f, l, c} from '../../styles/shared';
// custom
import Text from '../../components/Text';
import {TouchableOpacity} from 'react-native-gesture-handler';
import NavigationService from '../../services/NavigationService';

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
}

const IconSize = 25;

const Header: React.FC<Props> = ({
  title,
  useLogo,
  useBack,
  useDrawer,
  leftIcon,
  onLeftIconPress,
  rightIcon,
  onRightIconPress,
}) => {
  const {top} = useSafeAreaInsets();
  const goBack = () => {
    NavigationService.goBack();
  };

  const openDrawer = () => {
    NavigationService.openDrawer();
  };

  const renderLeft = () => {
    if (useDrawer) {
      return (
        <TouchableOpacity
          style={[styles.backContainer, l.pr5]}
          onPress={openDrawer}
          activeOpacity={0.7}>
          <Icon size={IconSize} color={c.black400} name={'menu'} />
        </TouchableOpacity>
      );
    }

    if (useBack) {
      return (
        <TouchableOpacity
          style={[styles.backContainer]}
          onPress={goBack}
          activeOpacity={0.7}>
          <Icon
            size={IconSize}
            color={c.black400}
            // name={'keyboard-backspace'}
            name={'arrow-back-ios'}
          />
        </TouchableOpacity>
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

    return <View style={{width: IconSize}} />;
  };

  return (
    <View
      style={[
        styles.container,
        BoxShadowStyles,
        {
          paddingTop: useLogo ? top : top + 10,
          paddingBottom: useLogo ? 0 : 10,
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

        {title ? (
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        ) : null}
      </View>
      {rightIcon && (
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
      )}
      {!rightIcon && <View style={{width: IconSize}} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: c.white,
    ...l.px20,
    ...l.pb15,
    ...l.flexRow,
    ...l.alignCtr,
    minHeight: 80,
  },
  backContainer: {
    width: IconSize + 5,
  },
  headerLogoContainer: {
    flex: 1,
    ...l.flexCenter,
  },
  headerLogoImg: {
    height: 40,
    width: 120,
    ...l.mb5,
  },
  title: {
    ...t.h4,
    ...f.fontWeightBold,
    ...l.fullWidth,
    textAlign: 'center',
    ...l.mx5,
  },
});

export default React.memo(Header);
