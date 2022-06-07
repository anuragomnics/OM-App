import React, {FC} from 'react';
import {View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {RootStackParams, ScreenID} from '../../navigation/types';
// custom
import Header from '../../components/Header';
import {ScrollView} from 'react-native-gesture-handler';
import {l} from '../../styles/shared';
import {ContainerStyles} from '../../styles/elements';
import EventsList from '../Dashboard/components/EventsList';

interface Props {
  route: RouteProp<RootStackParams, ScreenID.Checkout>;
}

const AllEvents: FC<Props> = ({route: {params = {}}}) => {
  // @ts-ignore
  const {content} = params;

  return (
    <View style={[ContainerStyles]}>
      <Header useBack title={content.title} />
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[l.p20]}>
        <EventsList {...content} ViewType={'AllEvents'} />
      </ScrollView>
    </View>
  );
};

export default AllEvents;
