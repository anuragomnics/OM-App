import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
// styles
import {c, t, f, l} from '../../../../styles/shared';
// custom
import Text from '../../../../components/Text';
import Button from '../../../../components/Button';
import Input from '../../../../components/FormControls/Input';

interface PriceRowProps {
  type: string;
  price: string;
}

const PriceRow: React.FC<PriceRowProps> = ({type, price}) => {
  return (
    <View style={styles.priceRow}>
      <Text style={[styles.price]}>{type}</Text>
      <Text style={[styles.price]}>{price}</Text>
    </View>
  );
};

const MembershipDetails = () => {
  return (
    <View>
      <Input placeholder={'coupon - Code'} />
      <Button theme={'primary'} title={'Order'} />
      <View style={styles.priceContainer}>
        <PriceRow type={'Sub-Total'} price={'100,00 €'} />
        <PriceRow type={'Tax 19%'} price={'19,00 €'} />
        <View style={styles.divider} />
        <PriceRow type={'Grand Totall'} price={'119,00 €'} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  priceContainer: {
    ...l.mt15,
  },
  priceRow: {
    ...l.flexRow,
    ...l.justifyBtw,
  },
  price: {},
  divider: {
    height: 1,
    backgroundColor: c.black400,
    ...l.my10,
  },
});

export default MembershipDetails;
