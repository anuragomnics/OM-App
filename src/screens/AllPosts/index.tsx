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
        <PostsList {...content} ViewType={'All'} />
        {/* <Text>hello i am all postsArr</Text> */}
      </ScrollView>
    </View>
  );
};

export default AllPosts;
