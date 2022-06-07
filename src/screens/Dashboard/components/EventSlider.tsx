import React, {FC} from 'react';
import {View, ScrollView, Image, Dimensions, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';

// custom
import {f, l, t} from '../../../styles/shared';
import {EventSlider as EventSliderType} from '../../../types/responses/SettingResponseType';
import Text from '../../../components/Text';

const deviceWidth = Dimensions.get('window').width;

const eventItemMargin = 15;
const eventItemWidth = deviceWidth / 2 - 2 * eventItemMargin - 60 / 2;

const EventSlider: FC<EventSliderType> = ({title, events}) => {
  return (
    <View style={[l.mb30]}>
      <Text style={[t.h3, f.fontWeightMedium]}>{title}</Text>
      <ScrollView
        style={[l.mt10]}
        contentContainerStyle={{flexDirection: 'row'}}
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}>
        {events.map((course, index) => {
          let courseTitle = course.name;
          return (
            <View
              style={{
                marginRight: index !== events.length - 1 ? eventItemMargin : 0,
                width: eventItemWidth,
                backgroundColor: '#fff',
                borderRadius: 5,
                overflow: 'hidden',
              }}
              key={index}>
              <FastImage
                source={{uri: course.image}}
                style={{width: '100%', height: 100}}
                resizeMode={FastImage.resizeMode.stretch}
              />
              <Text style={{...t.p, ...l.p10}} numberOfLines={2}>
                {courseTitle}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default EventSlider;
