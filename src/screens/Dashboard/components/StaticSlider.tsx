import React, {FC} from 'react';
import {View, ImageBackground, StyleSheet} from 'react-native';
import Button from '../../../components/Button';
import Text from '../../../components/Text';

// custom
import {f, l, t} from '../../../styles/shared';
import {BannerSectionType} from '../../../types/responses/SettingResponseType';

interface Props {
  fetchDashboardSettingsAPI?: (id: number, name: string) => void;
}

const StaticSlider: FC<BannerSectionType & Props> = ({
  fetchDashboardSettingsAPI,
  id,
  type,
  background_type,
  background_image_url,
  background_color,
  title,
  title_size_small,
  title_size_medium,
  title_size_large,
  title_text_color,
  title_layer_color,
  title_layer_transparency,
  sub_title,
  sub_title_size_small,
  sub_title_size_medium,
  sub_title_size_large,
  sub_title_text_color,
  sub_title_layer_color,
  sub_title_layer_transparency,
  destination_button,
  destination_id,
  destination_url,
}) => {
  const titleTransparency = title_layer_transparency
    ? title_layer_transparency.toString()
    : '00';
  const subsTitleTransparency = sub_title_layer_transparency
    ? sub_title_layer_transparency.toString()
    : '00';
  const titleBackgroundColor = title_layer_color + titleTransparency;
  const subTitleBackgroundColor = sub_title_layer_color + subsTitleTransparency;

  const onDestinationButtonPress = (id: number, name: string) => {
    fetchDashboardSettingsAPI?.(id, name);
  };

  return (
    <View style={[l.m20, l.mb30]}>
      <ImageBackground
        source={{
          uri: background_type === 'image' ? background_image_url || '' : '',
        }}
        resizeMode={'cover'}
        style={[
          styles.staticSliderImg,
          {
            backgroundColor:
              background_type !== 'image' ? background_color : '',
            borderRadius: 10,
          },
        ]}>
        {/* image overlay */}
        <View style={styles.overlay} />

        {/* title */}
        {title ? (
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
                  fontSize: title_size_medium,
                },
                // f.fontWeightMedium,
              ]}>
              {title}
            </Text>
          </View>
        ) : null}

        {/* sub-title */}
        {sub_title ? (
          <View
            style={[
              styles.staticSliderSubTextContainer,
              {backgroundColor: subTitleBackgroundColor},
            ]}>
            <Text
              style={[
                styles.staticSliderText,
                {
                  color: sub_title_text_color,
                  fontSize: sub_title_size_small,
                },
                // f.fontWeightMedium,
              ]}>
              {sub_title}
            </Text>
          </View>
        ) : null}

        {/* destination Btn */}
        {/* {destination_button ? (
          <Button
            title={''}
            theme={'primary'}
            widgetStyles={{
              container: styles.destinationBtn,
            }}
            onPress={() => {
              onDestinationButtonPress(
                // @ts-ignore
                parseInt(destination_id),
                '',
              );
            }}
          />
        ) : null} */}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    ...l.p20,
    // ...l.mb30,
  },
  staticSliderImg: {
    height: 200,
    ...l.justifyCtr,
    ...l.alignCtr,
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
    ...f.fontWeightMedium,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  destinationBtn: {
    minHeight: 40,
    ...l.mt10,
  },
});

export default StaticSlider;
