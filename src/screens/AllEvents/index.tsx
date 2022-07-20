import React, {FC} from 'react';
import {View, ScrollView} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {RootStackParams, ScreenID} from '../../navigation/types';

// custom
import Header from '../../components/Header';
import {l} from '../../styles/shared';
import {useContainerStyles} from '../../styles/elements';
import PostsList from '../Dashboard/components/PostsList';
import Text from '../../components/Text';
import EventsList from '../Dashboard/components/EventsList';

interface Props {
  route: RouteProp<RootStackParams, ScreenID.Checkout>;
}

const AllPosts: FC<Props> = ({route: {params = {}}}) => {
  // @ts-ignore
  const {content} = params;
  const ContainerStyles = useContainerStyles();

  return (
    <View style={[ContainerStyles]}>
      <Header useBack title={content.title} />
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[l.p20]}>
        <EventsList {...content} ViewType={'All'} />
      </ScrollView>
    </View>
  );
};

export default AllPosts;
