import React, {FC} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import Text from '../../../components/Text';
import DeviceHelper from '../../../config/DeviceHelper';
import {c, f, l, t} from '../../../styles/shared';
import {NewsNavigationBarType} from '../../../types/responses/SettingResponseType';

const bannerWidth = (DeviceHelper.width - 40) / 2 - 10 / 2;

interface Props {
  fetchDashboardSettingsAPI: (id: number, name: string) => void;
}

const NewsNavigationBar: FC<NewsNavigationBarType & Props> = ({
  title,
  banner,
  fetchDashboardSettingsAPI,
}) => {
  const onBannerItemPress = (id: number, name: string) => {
    fetchDashboardSettingsAPI(id, name);
  };

  return (
    <View style={[l.mb30]}>
      <Text style={[t.h3, f.fontWeightMedium]}>{title}</Text>
      <View style={[l.flexRow, l.alignCtr, l.justifyBtw, l.wrap, l.mt5]}>
        {banner.map((bannerItem, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={[styles.bannerItemContainer, {width: bannerWidth}]}
              onPress={() => {
                onBannerItemPress(
                  parseInt(bannerItem.destination_page?.id),
                  bannerItem.destination_page?.name,
                );
              }}>
              <Text style={[f.fontWeightMedium, {textAlign: 'center'}]}>
                {bannerItem.destination_page?.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerItemContainer: {
    backgroundColor: c.white,
    ...l.p20,
    ...l.mt10,
    ...l.defaultBorderRadius,
  },
});

export default NewsNavigationBar;
