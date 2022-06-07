import React, {FC} from 'react';
import {View, Text, ImageBackground, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Button from '../../../components/Button';
import Input from '../../../components/FormControls/Input';
import {ScreenID} from '../../../navigation/types';
import NavigationService from '../../../services/NavigationService';

// custom
import {f, l, c, t} from '../../../styles/shared';
import {StaticSlider as StaticSliderType} from '../../../types/responses/SettingResponseType';

const StaticSlider: FC<StaticSliderType> = ({
  background_type,
  background_image,
  background_color,
  title,
  title_layer_color,
  title_layer_transparency,
  title_text_color,
  title_size_medium,
  subtitle,
  subtitle_text_color,
  subtitle_size_small,
  subtitle_layer_transparency,
  subtitle_layer_color,
}) => {
  const goToLawTextDetail = () => {
    NavigationService.pushToScreen(ScreenID.LawTextDetail);
  };
  const titleTransparency = title_layer_transparency
    ? (100 - parseInt(title_layer_transparency)).toString()
    : '00';
  const subsTitleTransparency = title_layer_transparency
    ? (100 - parseInt(title_layer_transparency)).toString()
    : '00';
  const titleBackgroundColor = title_layer_color + titleTransparency;
  const subTitleBackgroundColor = subtitle_layer_color + subsTitleTransparency;

  return (
    <View>
      <ImageBackground
        source={{
          uri: background_type === 'image' ? background_image : '',
        }}
        resizeMode={'cover'}
        style={[
          styles.staticSliderImg,
          {
            backgroundColor:
              background_type !== 'image' ? background_color : '',
          },
          l.mb30,
        ]}>
        {/* title */}
        <View style={[l.flexRow, l.justifyCtr]}>
          <View
            style={[
              styles.staticSliderTextContainer,
              {backgroundColor: titleBackgroundColor},
            ]}>
            <Text
              style={[
                styles.staticSliderText,
                {
                  color: title_text_color,
                  fontSize: parseInt(title_size_medium || '20'),
                },
              ]}>
              {title}
            </Text>
          </View>
        </View>

        {/* sub-title */}
        <View style={[l.flexRow, l.justifyCtr]}>
          <View
            style={[
              styles.staticSliderSubTextContainer,
              {backgroundColor: subTitleBackgroundColor},
            ]}>
            <Text
              style={[
                styles.staticSliderText,
                {
                  color: subtitle_text_color,
                  fontSize: parseInt(subtitle_size_small || '20'),
                },
              ]}>
              {subtitle}
            </Text>
          </View>
        </View>

        {/* enter email */}
        <View style={[l.flexRow, l.alignCtr, l.mt30]}>
          <Input
            widgetStyles={{
              container: {...l.flex, marginBottom: 0},
              wrapper: {backgroundColor: c.white},
            }}
            placeholder={'Enter your email'}
            leftIcon={{iconName: 'search'}}
          />
          <Button theme={'primary'} title={'Subscribe'} />
        </View>

        {/* terms and conditions */}
        <TouchableOpacity onPress={goToLawTextDetail}>
          <Text style={styles.termsAndConditions}>
            {'Terms and Conditions  '}
            <Text style={styles.moreInfo}>{`(More info...)`}</Text>
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    ...l.p20,
  },
  staticSliderImg: {
    width: '100%',
    ...l.p20,
    // ...l.defaultBorderRadius,
    overflow: 'hidden',
    backgroundColor: 'red',
  },
  staticSliderTextContainer: {},
  staticSliderSubTextContainer: {
    ...l.mt10,
  },
  staticSliderTextWrapper: {
    position: 'absolute',
    height: '100%',
    ...l.fullWidth,
    ...l.defaultBorderRadius,
  },
  staticSliderText: {
    ...l.p10,
    textAlign: 'center',
  },
  termsAndConditions: {
    color: c.white,
    ...f.fontWeightMedium,
    textAlign: 'center',
    ...l.mt20,
    ...l.mb20,
  },
  moreInfo: {
    ...t.pSM,
    textAlign: 'center',
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
  },
});

export default StaticSlider;
