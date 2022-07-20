import React, {FC, useEffect, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Button from '../../../components/Button';
import Checkbox from '../../../components/FormControls/Checkbox';
import Input from '../../../components/FormControls/Input';
import {ScreenID} from '../../../navigation/types';
import NavigationService from '../../../services/NavigationService';

// custom
import {f, l, c, t} from '../../../styles/shared';
import {NewsLetterSectionType} from '../../../types/responses/SettingResponseType';
import {getParsedTextFromHTML} from '../../../utils/HTMLParser';
import {useSingleLawTextDetail} from '../../LegalTextDetail/hook';

const StaticSlider: FC<NewsLetterSectionType> = ({
  id,
  type,
  background_type,
  background_image_id,
  background_color,
  title,
  title_size_small,
  title_size_medium,
  title_size_large,
  title_text_color,
  title_layer_color,
  title_layer_transparency,
  legal_text_id,
  extra_enable,
  extra_required,
}) => {
  // state
  const [termsAndConditionsChecked, setTermsAndConditionsChecked] =
    useState(false);
  let legelTextDetails;
  if (legal_text_id) {
    legelTextDetails = useSingleLawTextDetail(legal_text_id);
  }

  const goToLawTextDetail = (id: number) => {
    NavigationService.pushToScreen(ScreenID.LegalTextDetail, {
      id,
    });
  };
  const titleTransparency = title_layer_transparency
    ? (100 - title_layer_transparency).toString()
    : '00';

  const titleBackgroundColor = title_layer_color + titleTransparency;

  const legalText = getParsedTextFromHTML(
    legelTextDetails?.legalText?.element || '',
  );

  return (
    <View>
      <ImageBackground
        source={{
          uri: background_type === 'image' ? '' : '',
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
                  fontSize: title_size_medium,
                },
              ]}>
              {title}
            </Text>
          </View>
        </View>

        {/* extra enabled : add firstname lastname */}
        {extra_enable ? (
          <View style={[l.mt30]}>
            <View style={[l.flexRow, l.alignCtr]}>
              <Input
                widgetStyles={{
                  container: {...l.flex, marginBottom: 0, ...l.mr5},
                }}
                placeholder={'Enter your firstname'}
              />
              <Input
                widgetStyles={{
                  container: {...l.flex, marginBottom: 0, ...l.ml5},
                }}
                placeholder={'Enter your lastname'}
              />
            </View>

            <Input
              widgetStyles={{
                container: {...l.flex, ...l.mt10, marginBottom: 0},
              }}
              placeholder={'Enter your email'}
            />
            <Button
              theme={'primary'}
              title={'Subscribe'}
              widgetStyles={{
                container: {...l.mt10},
              }}
            />
          </View>
        ) : (
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
        )}

        {/* terms and conditions */}
        {legal_text_id ? (
          <View style={[l.flexRow, l.alignCtr, l.mt20]}>
            <Checkbox
              onValueChange={bool => {
                setTermsAndConditionsChecked(bool);
              }}
              checked={termsAndConditionsChecked}
            />
            <TouchableOpacity
              onPress={() => {
                goToLawTextDetail(legal_text_id);
              }}
              style={[l.ml5]}>
              <Text>
                <Text style={styles.termsAndConditions}>{legalText}</Text>{' '}
                <Text style={styles.moreInfo}>{`(More info...)`}</Text>
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
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
    // ...l.mt20,
    ...l.mb10,
  },
  moreInfo: {
    color: c.white,
    ...t.pSM,
    textAlign: 'center',
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
  },
});

export default StaticSlider;
