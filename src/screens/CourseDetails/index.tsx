import React, {Component, FC, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialIcons';

//custom
import Text from '../../components/Text';
import {RootStackParams, ScreenID} from '../../navigation/types';
import {ChapterType} from '../../types/responses/SingleCourseResponseType';
import {c, f, l, t} from '../../styles/shared';
import {ContainerStyles} from '../../styles/elements';
import {usePrimaryStyles} from '../../hooks/useThemeStyles';
import {useSingleCourse} from './hook';
import {CourseType} from '../../types/responses/CourseResponseType';
import SpinnerLoader from '../../loaders/SpinnerLoader';
import NavigationService from '../../services/NavigationService';
import TabBar from '../../components/TabBar';
import DetailsBannerImage from '../../components/DetailsBannerImage';

interface Props {
  route: RouteProp<RootStackParams, ScreenID.CouseDetails>;
}

interface TAB {
  name: string;
  id: number;
}

const TABS = [
  {
    name: 'Description',
    id: 0,
  },
  {
    name: 'Course Content',
    id: 1,
  },
];

const CourseDetails: FC<Props> = ({route}) => {
  // @ts-ignore
  const {course = {}} = route.params;
  const {data, isLoading} = useSingleCourse(course.id);
  const {color} = usePrimaryStyles();

  // state
  const [selectedTab, setSelectedTab] = useState<TAB>(TABS[0]);

  const goBack = () => {
    NavigationService.goBack();
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        goBack();
        return true;
      },
    );
    // cleanup handler
    return () => {
      backHandler?.remove();
    };
  }, []);

  return (
    <View
      style={[
        ContainerStyles,
        {backgroundColor: '#fff', position: 'relative'},
      ]}>
      <StatusBar barStyle={'light-content'} networkActivityIndicatorVisible />
      <View style={styles.statusBar} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[l.pb20]}
        bounces={false}>
        {/* banner image */}
        <DetailsBannerImage imageUrl={course.thumbnail} onBackPress={goBack} />

        {/* title */}
        <View style={[l.px20]}>
          {/* title and progress */}
          <View style={[l.flexRow, l.alignCtr, l.my20]}>
            <Text style={[t.h4, f.fontWeightMedium, {lineHeight: 22}]}>
              {course.title}
            </Text>
          </View>
        </View>

        <TabBar
          tabs={TABS}
          onSelectTab={tab => {
            setSelectedTab(tab);
          }}
        />
        <View style={[l.flex, l.px20]}>
          <View style={[l.mt20]}>
            {selectedTab.id === 0 ? (
              <>{renderDescrption(course, color)}</>
            ) : null}
            {selectedTab.id === 1 ? (
              <View>{renderChapters(data?.chapters, color, isLoading)}</View>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const renderDescrption = (course: CourseType, color: string | undefined) => {
  return (
    <View>
      <View style={[l.flexRow, l.alignCtr, l.py5]}>
        <View style={[l.flexRow, l.alignCtr]}>
          <Icon name={'headset'} color={color} size={16} />
          <Text style={[l.ml5, {color: c.black400}]}>
            {`${course.chapters} chapters`}
          </Text>
        </View>
        <View style={[l.flexRow, l.alignCtr, l.ml15]}>
          <Icon name={'schedule'} color={color} size={16} />
          <Text style={[l.ml5, {color: c.black400}]}>{course.duration}</Text>
        </View>
      </View>
      <View style={styles.descriptionDivider} />
      <Text style={[l.mb10, t.h4, f.fontWeightMedium]}>
        {'About this course'}
      </Text>
      <Text style={[{lineHeight: 24}]}>
        {course.description ? course.description : ''}
      </Text>
    </View>
  );
};

const renderChapters = (
  chapters: ChapterType[] = [],
  primaryColor: string | undefined,
  isLoading: boolean,
) => {
  const goToCouseVideoPlayer = (chapter: ChapterType) => {
    // NavigationService.pushToScreen(ScreenID.VideoPlayer, {
    //   chapter,
    //   allChapters: chapters,
    // });
  };

  return (
    <View style={[l.mt10]}>
      {isLoading && <SpinnerLoader />}

      {/* no chapters */}
      {(!chapters || chapters.length === 0) && (
        <View>
          <Text>No content avilable</Text>
        </View>
      )}

      {chapters &&
        chapters.length > 0 &&
        chapters.map((chapter, index) => {
          return (
            <View key={index}>
              <TouchableOpacity
                disabled={!chapter.watch_duration_total}
                style={[l.flexRow, l.alignCtr]}
                onPress={() => {
                  goToCouseVideoPlayer(chapter);
                }}>
                {chapter.title_image ? (
                  <FastImage
                    source={{
                      uri: chapter.title_image,
                    }}
                    style={styles.chapterBannerImg}
                    resizeMode={FastImage.resizeMode.stretch}
                  />
                ) : (
                  <Icon name={'slideshow'} size={30} color={c.black200} />
                )}

                <View style={[l.mx10, l.flex]}>
                  <Text numberOfLines={1} style={[t.h5]}>
                    {chapter.title}
                  </Text>
                  <View style={[l.flexRow, l.alignCtr, l.mt5]}>
                    <Text style={[{color: primaryColor}, t.pSM]}>
                      {chapter.watch_duration_total} Mins
                    </Text>
                  </View>
                </View>
                <Icon
                  name={'play-circle-filled'}
                  size={30}
                  color={chapter.watch_duration_total ? primaryColor : c.grey50}
                />
              </TouchableOpacity>
              {index !== chapters.length - 1 ? (
                <View style={styles.chaptersDivider} />
              ) : null}
            </View>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  courseBannerImg: {
    height: 250,
    ...l.fullWidth,
  },
  chapterBannerImg: {
    height: 40,
    width: 40,
    ...l.defaultBorderRadius,
  },
  progress: {
    height: 60,
    width: 60,
    borderRadius: 60,
    backgroundColor: c.grey50,
  },
  chaptersDivider: {
    height: 1.5,
    backgroundColor: c.grey50,
    ...l.my20,
  },
  descriptionDivider: {
    height: 1.5,
    backgroundColor: c.grey50,
    ...l.my20,
  },
  backContainer: {
    backgroundColor: c.white,
    height: 30,
    width: 30,
    borderRadius: 40,
    ...l.justifyCtr,
    ...l.alignCtr,
    ...l.m15,
    ...l.mt10,
  },
  statusBar: {
    position: 'absolute',
    backgroundColor: c.black1000,
    height: 40,
    width: '100%',
    opacity: 0.5,
    zIndex: 999,
  },
});

export default CourseDetails;
