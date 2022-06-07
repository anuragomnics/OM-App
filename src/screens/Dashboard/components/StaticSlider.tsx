import React, {FC} from 'react';
import {View, Text, ImageBackground, StyleSheet} from 'react-native';
import Button from '../../../components/Button';

// custom
import {f, l, t} from '../../../styles/shared';
import {StaticSlider as StaticSliderType} from '../../../types/responses/SettingResponseType';

interface Props {
  fetchDashboardSettingsAPI?: (id: number, name: string) => void;
}

const StaticSlider: FC<StaticSliderType & Props> = ({
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
  destination_button_status,
  destination_button_link_page,
  fetchDashboardSettingsAPI,
}) => {
  const titleTransparency = title_layer_transparency
    ? parseInt(title_layer_transparency).toString()
    : '00';
  const subsTitleTransparency = title_layer_transparency
    ? parseInt(title_layer_transparency).toString()
    : '00';
  const titleBackgroundColor = title_layer_color + titleTransparency;
  const subTitleBackgroundColor = subtitle_layer_color + subsTitleTransparency;

  const onDestinationButtonPress = (id: number, name: string) => {
    fetchDashboardSettingsAPI?.(id, name);
  };

  return (
    <View style={[l.mb20]}>
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
        ]}>
        {/* image overlay */}
        <View style={styles.overlay} />

        {/* title */}
        {title && (
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
        )}

        {/* sub-title */}
        {subtitle && (
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
                  fontSize: parseInt(subtitle_size_small || '16'),
                },
              ]}>
              {subtitle}
            </Text>
          </View>
        )}

        {/* destination Btn */}
        {destination_button_status && destination_button_link_page?.name && (
          <Button
            title={destination_button_link_page.name}
            theme={'primary'}
            widgetStyles={{
              container: styles.destinationBtn,
            }}
            onPress={() => {
              onDestinationButtonPress(
                // @ts-ignore
                parseInt(destination_button_link_page.id),
                destination_button_link_page.name,
              );
            }}
          />
        )}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    ...l.p20,
  },
  staticSliderImg: {
    height: 250,
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
