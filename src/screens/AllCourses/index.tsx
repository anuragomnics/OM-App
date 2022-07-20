import React, {FC} from 'react';
import {View, ScrollView} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {RootStackParams, ScreenID} from '../../navigation/types';
// custom
import Header from '../../components/Header';
import Text from '../../components/Text';
import CourseList from '../Dashboard/components/CourseList';
import {l} from '../../styles/shared';
import {ContainerStyles} from '../../styles/elements';

interface Props {
  route: RouteProp<RootStackParams, ScreenID.Checkout>;
}

const AllCourses: FC<Props> = ({route: {params = {}}}) => {
  // @ts-ignore
  const {content, searchText} = params;

  return (
    <View style={[ContainerStyles]}>
      <Header useBack title={content.title} />
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[l.p20]}>
        <CourseList
          {...content}
          ViewType={'AllCourses'}
          initialSearchText={searchText}
        />
      </ScrollView>
    </View>
  );
};

export default AllCourses;
