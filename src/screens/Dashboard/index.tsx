import React, {useEffect, useRef, useState} from 'react';
import {View, ScrollView, StyleSheet, RefreshControl} from 'react-native';

//custom
import Header from '../../components/Header';
import {useContainerStyles} from '../../styles/elements';
import {f, l, t} from '../../styles/shared';
import Text from '../../components/Text';
import {
  useAppDispatch,
  useAppSelector,
  useThunkCallbackAction,
} from '../../hooks/useRedux';
import {
  DashBoardSelector,
  DrawerNavigationSelector,
  fetchAppNavigations,
  fetchAppSettingsNew,
  fetchDashboardSettings,
  FetchDashboardSettingsPrefix,
  SelectedNavigationSelector,
  setSelectedNavigation,
  SettingsSelector,
  ThemeSelector,
} from '../../store/Configuration';
import {resetCoursesList} from '../../store/Course';
import {resetNewsList} from '../../store/News';
import {resetEventsList} from '../../store/Events';
import CourseList from './components/CourseList';
import {StatusSelector} from '../../store/Status';
import StaticSlider from './components/StaticSlider';
import CourseSlider from './components/CourseSlider';
import EventSlider from './components/EventSlider';
import NewsLetter from './components/NewsLetter';
import PostsList from './components/PostsList';
import SpinnerLoader from '../../loaders/SpinnerLoader';
import EventsList from './components/EventsList';
import NewsNavigationBar from './components/NewsNavigationBar';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {NavigationType} from '../../types/responses/NavigationsResponseType';
import {useSelector} from 'react-redux';
import FastImage from 'react-native-fast-image';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const drawerNavigations = useAppSelector(DrawerNavigationSelector());
  const settings = useAppSelector(SettingsSelector());
  const dashboard = useAppSelector(DashBoardSelector());
  const {error, pending} = useAppSelector(
    StatusSelector(FetchDashboardSettingsPrefix),
  );
  const selectedNavigation = useAppSelector(SelectedNavigationSelector());
  const appTheme = useSelector(ThemeSelector());

  const ContainerStyles = useContainerStyles();

  // ref
  const firstRender = useRef(true);

  // state
  const [refreshing, setRefreshing] = useState(false);
  const [defaultPage, setDefaultPage] = useState<NavigationType>();

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
          setDefaultPage(drawerNavigation);
        }
      });
    }
    dispatch(resetCoursesList());
    dispatch(resetNewsList());
    dispatch(resetEventsList());
  }, [selectedNavigation.id]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardSettingsAPI(selectedNavigation.id, selectedNavigation.name);
    dispatch(fetchAppSettingsNew());
    dispatch(fetchAppNavigations());
  };

  useThunkCallbackAction(
    FetchDashboardSettingsPrefix,
    () => {
      setRefreshing(false);
    },
    () => {
      setRefreshing(false);
    },
  );

  const isStatingWithBanner = dashboard?.[0]?.type === 'Banner';

  const getHighlightedDrawerNavigations = () => {
    let navigations: NavigationType[] = [];
    drawerNavigations.map((nav1, i) => {
      if (nav1.page_highlight_app) {
        navigations.push(nav1);
      }
      if (nav1.children) {
        nav1.children.map(nav2 => {
          if (nav2.page_highlight_app) {
            navigations.push(nav2);
          }
          if (nav2.children) {
            nav2.children.map(nav3 => {
              if (nav3.page_highlight_app) {
                navigations.push(nav3);
              }
            });
          }
        });
      }
    });
    navigations = navigations.slice(0, 5);
    return navigations;
  };

  const highlitedDrawerNavigations = getHighlightedDrawerNavigations();
  const defaultPage_image_url =
    appTheme === 'dark'
      ? settings.main_logo_monochrome_url
      : settings.main_logo_url;

  return (
    <View style={[ContainerStyles]}>
      {selectedNavigation?.id === defaultPage?.id && defaultPage_image_url ? (
        <Header
          title={selectedNavigation?.name || 'Dashboard'}
          useDrawer
          defaultPageLogo
        />
      ) : (
        <Header title={selectedNavigation?.name || 'Dashboard'} useDrawer />
      )}

      {pending && <SpinnerLoader />}
      {!pending && (
        <ScrollView
          style={[
            styles.mainWrapper,
            isStatingWithBanner ? {paddingTop: 0} : {},
            {
              marginBottom:
                highlitedDrawerNavigations &&
                highlitedDrawerNavigations.length > 0
                  ? 0
                  : useSafeAreaInsets().bottom,
            },
          ]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[l.pb20]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              enabled
            />
          }>
          {/* <NewsLetter /> */}
          {dashboard.map((content, index) => {
            if (content.type === 'Banner')
              return (
                <View key={index}>
                  {/* @ts-ignore */}
                  <StaticSlider
                    {...content}
                    fetchDashboardSettingsAPI={fetchDashboardSettingsAPI}
                  />
                </View>
              );
            if (content.type === 'NewsLetter')
              // @ts-ignore
              return <NewsLetter {...content} key={index} index={index} />;
            if (content.type === 'post-carousel')
              return (
                <View style={styles.wrapper} key={index}>
                  {/*  @ts-ignore */}
                  <CourseSlider {...content} content={content} index={index} />
                </View>
              );
            if (content.type === 'course_list')
              return (
                <View style={styles.wrapper} key={index}>
                  {/*  @ts-ignore */}
                  <CourseList {...content} content={content} index={index} />
                </View>
              );
            if (content.type === 'post-list')
              return (
                <View style={styles.wrapper} key={index}>
                  <PostsList
                    {...content}
                    // @ts-ignore
                    content={content}
                    index={index}
                  />
                </View>
              );
            if (content.type === 'event-list')
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
            if (content.type === 'event-carousel')
              return (
                <View style={styles.wrapper} key={index}>
                  <EventSlider
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
