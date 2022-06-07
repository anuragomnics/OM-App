import React, {useEffect, useRef, useState} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';

//custom
import Header from '../../components/Header';
import {ContainerStyles} from '../../styles/elements';
import {f, l, t} from '../../styles/shared';
import Text from '../../components/Text';
import {useAppDispatch, useAppSelector} from '../../hooks/useRedux';
import {
  DashBoardSelector,
  DrawerNavigationSelector,
  fetchDashboardSettings,
  FetchDashboardSettingsPrefix,
  SelectedNavigationSelector,
  setSelectedNavigation,
} from '../../store/Configuration';
import {resetCoursesList} from '../../store/Course';
import {resetNewsList} from '../../store/News';
import {resetEventsList} from '../../store/Events';
import CourseList from './components/CourseList';
import {StatusSelector} from '../../store/Status';
import StaticSlider from './components/StaticSlider';
import CourseSlider from './components/CourseSlider';
import NewsLetter from './components/NewsLetter';
import NewsList from './components/NewsList';
import SpinnerLoader from '../../loaders/SpinnerLoader';
import EventsList from './components/EventsList';
import NewsNavigationBar from './components/NewsNavigationBar';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const drawerNavigations = useAppSelector(DrawerNavigationSelector());
  const dashboard = useAppSelector(DashBoardSelector());
  const {error, pending} = useAppSelector(
    StatusSelector(FetchDashboardSettingsPrefix),
  );
  const selectedNavigation = useAppSelector(SelectedNavigationSelector());

  // ref
  const firstRender = useRef(true);

  const fetchDashboardSettingsAPI = (id: number, name: string) => {
    dispatch(setSelectedNavigation({id, name}));
    dispatch(fetchDashboardSettings(id));
  };

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      drawerNavigations.map(drawerNavigation => {
        if (drawerNavigation.default_page) {
          fetchDashboardSettingsAPI(drawerNavigation.id, drawerNavigation.name);
        }
      });
    }
    dispatch(resetCoursesList());
    dispatch(resetNewsList());
    dispatch(resetEventsList());
  }, [selectedNavigation.id]);

  const isStatingWithStaticSlider = dashboard?.[0]?.type === 'static_slider';

  return (
    <View style={[ContainerStyles]}>
      <Header title={selectedNavigation?.name || 'Dashboard'} useDrawer />
      {pending && <SpinnerLoader />}
      {!pending && (
        <ScrollView
          style={[
            styles.mainWrapper,
            isStatingWithStaticSlider ? {paddingTop: 0} : {},
          ]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[l.pb20]}
          bounces={false}>
          {/* <NewsLetter /> */}
          {dashboard.map((content, index) => {
            if (content.type === 'static_slider')
              return (
                <View key={index}>
                  {/* @ts-ignore */}
                  <StaticSlider
                    {...content}
                    fetchDashboardSettingsAPI={fetchDashboardSettingsAPI}
                  />
                </View>
              );
            if (content.type === 'newsletter_banner')
              // @ts-ignore
              return <NewsLetter {...content} key={index} index={index} />;
            if (
              content.type === 'course_slider' ||
              content.type === 'event_slider' ||
              content.type === 'news_slider'
            )
              return (
                <View style={styles.wrapper} key={index}>
                  {/*  @ts-ignore */}
                  <CourseSlider {...content} index={index} />
                </View>
              );
            if (content.type === 'course_list')
              return (
                <View style={styles.wrapper} key={index}>
                  {/*  @ts-ignore */}
                  <CourseList {...content} content={content} index={index} />
                </View>
              );
            if (content.type === 'news_list')
              return (
                <View style={styles.wrapper} key={index}>
                  <NewsList
                    {...content}
                    // @ts-ignore
                    content={content}
                    index={index}
                  />
                </View>
              );
            if (content.type === 'event_list')
              return (
                <View style={styles.wrapper} key={index}>
                  <EventsList
                    {...content}
                    // @ts-ignore
                    content={content}
                    index={index}
                  />
                </View>
              );

            if (content.type === 'news_navigation_bar')
              return (
                <View style={styles.wrapper} key={index}>
                  {/*  @ts-ignore */}
                  <NewsNavigationBar
                    {...content}
                    fetchDashboardSettingsAPI={fetchDashboardSettingsAPI}
                  />
                </View>
              );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    ...l.py20,
  },
  wrapper: {
    ...l.px20,
  },
  staticSliderImg: {
    height: 250,
    ...l.justifyEnd,
    ...l.alignCtr,
    ...l.p10,
    ...l.defaultBorderRadius,
    overflow: 'hidden',
    backgroundColor: 'red',
  },
  staticSliderTextContainer: {
    position: 'relative',
    ...l.fullWidth,
  },
  staticSliderTextWrapper: {
    position: 'absolute',
    height: '100%',
    ...l.fullWidth,
    ...l.defaultBorderRadius,
  },
  staticSliderText: {
    ...l.p10,
  },

  //   courses
  courseContainer: {
    width: '60%',
    height: 100,
    backgroundColor: 'red',
  },
});

export default Dashboard;
