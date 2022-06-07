import React, {FC} from 'react';
import {View, StyleSheet} from 'react-native';
// custom
import {t, f, l, c} from '../../../styles/shared';
import Button from '../../../components/Button';
import {BoxShadowStyles} from '../../../styles/elements';
import Text from '../../../components/Text';
import {usePrimaryStyles} from '../../../hooks/useThemeStyles';
import FastImage from 'react-native-fast-image';
import {ShowOfferMembership} from '../../../types/responses/SettingResponseType';
import DeviceHelper from '../../../config/DeviceHelper';

interface MembershipProductProps {
  item: ShowOfferMembership;
  goToCheckout?: () => void;
}

const MembershipProduct: FC<MembershipProductProps> = ({
  item: {
    image_url,
    name,
    description,
    display_price,
    old_price,
    display_old_price,
    interval,
  },
  goToCheckout,
}) => {
  const primaryTextStyle = usePrimaryStyles().textStyle;
  const onPress = () => {
    goToCheckout?.();
  };

  const buttonTitle = `Buchen ${name}`;

  return (
    <View style={[styles.container, l.flexRow]}>
      {/* <FastImage source={{uri: image_url}} style={{height: 70, width: 70}} /> */}
      <View style={[l.flex]}>
        <Text style={[styles.productName]}>{name}</Text>
        <Text style={[styles.productDesciption]}>{description}</Text>
        <View style={styles.priceContainer}>
          <Text style={[primaryTextStyle, styles.displayPrice]}>
            {display_price} / {interval}
          </Text>
          {old_price && display_old_price ? (
            <Text style={[primaryTextStyle, styles.displayOldPrice]}>
              {display_old_price}
            </Text>
          ) : null}
        </View>

        <Button onPress={onPress} title={buttonTitle} theme={'primary'} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: c.white,
    ...l.p20,
    ...l.mt15,
    ...l.defaultBorderRadius,
  },
  productName: {
    ...t.h4,
    ...f.fontWeightMedium,
  },
  productDesciption: {
    ...l.mt5,
    lineHeight: 20,
    color: c.black200,
  },
  priceContainer: {
    ...l.mt10,
    ...l.mb20,
    ...l.flexRow,
    ...l.alignCtr,
  },
  displayPrice: {
    ...t.h4,
    ...f.fontWeightBold,
  },
  displayOldPrice: {
    // ...f.fontWeightBold,
    ...l.ml5,
    textDecorationStyle: 'solid',
    textDecorationLine: 'line-through',
  },
});

export default MembershipProduct;
