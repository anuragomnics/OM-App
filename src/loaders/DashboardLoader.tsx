import React from 'react';
import {View} from 'react-native';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';
import {l} from '../styles/shared';

const DashboardLoader = () => (
  <Placeholder Animation={Fade} style={[l.p20]}>
    <PlaceholderLine style={[l.defaultBorderRadius, {height: 250}]} />

    <PlaceholderLine style={[l.mt20, l.mb10, {width: 100}]} />
    <View style={[l.flexRow]}>
      <PlaceholderLine style={[{width: 150, height: 150}]} />
      <PlaceholderLine style={[{width: 150, height: 150}, l.ml20]} />
    </View>

    <PlaceholderLine style={[l.mt20, l.mb10, {width: 120}]} />
    <PlaceholderLine style={[{height: 150}]} />
    <PlaceholderLine style={[{height: 150}, l.mt15]} />
  </Placeholder>
);

export default DashboardLoader;
