import React, {FC, useCallback, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity, Linking} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

// custom
import Text from '../components/Text';
import {useAppDispatch, useAppSelector} from '../hooks/useRedux';
import Dashboard from '../screens/Dashboard';
import {
  fetchDashboardSettings,
  TabsNavigationSelector,
  DrawerNavigationSelector,
  setSelectedNavigation,
  SelectedNavigationSelector,
  ThemeSelector,
} from '../store/Configuration';
import FastImage from 'react-native-fast-image';
import {l, t, c, f} from '../styles/shared';
import {resetEventsList} from '../store/Events';
import {resetNewsList} from '../store/News';
import {resetCoursesList} from '../store/Course';
import {
  BarNavigation,
  DrawerNavigation,
} from '../types/responses/SettingResponseType';
import {useFontStyle} from '../components/AppFonts';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {usePrimaryStyles} from '../hooks/useThemeStyles';
import {BoxShadowStyles} from '../styles/elements';
import {openLink} from '../components/Browser';
import NavigationService from '../services/NavigationService';
import {ScreenID} from './types';
import {NavigationType} from '../types/responses/NavigationsResponseType';
import {useColors} from '../styles/shared/Colors';

const Tab = createBottomTabNavigator();

const getHighlightedDrawerNavigations = (
  drawerNavigations: NavigationType[],
) => {
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

interface MyTabBarProps {
  tabNavigations: NavigationType[];
}
const MyTabBar: FC<MyTabBarProps> = ({tabNavigations}) => {
  const selectedNavigation = useAppSelector(SelectedNavigationSelector());
  const primaryColor = usePrimaryStyles().color;
  const dispatch = useAppDispatch();
  const {bottom} = useSafeAreaInsets();
  const fetchDashboardSettingsAPI = (navigation: NavigationType) => {
    if (navigation.page_type === 'link') {
      if (navigation.link_url) {
        openLink(navigation.link_url);
      }
    } else {
      dispatch(fetchDashboardSettings(navigation.id));
      dispatch(
        setSelectedNavigation({id: navigation.id, name: navigation.name}),
      );
    }
  };

  const colors = useColors();
  const appTheme = useAppSelector(ThemeSelector());

  return (
    <>
      {tabNavigations && tabNavigations.length > 0 && (
        <View
          style={[
            l.flexRow,
            l.alignCtr,
            BoxShadowStyles,
            {backgroundColor: colors.white, paddingBottom: bottom},
          ]}>
          {tabNavigations.map((tabNavigation, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  fetchDashboardSettingsAPI(tabNavigation);
                }}
                style={[l.px5, l.py10, l.flex, l.justifyCtr, l.alignCtr]}>
                {tabNavigation.page_icon ? (
                  <FastImage
                    source={{
                      uri:
                        appTheme === 'dark'
                          ? tabNavigation.page_icon_monochrome
                            ? tabNavigation.page_icon_monochrome
                            : tabNavigation.page_icon
                          : tabNavigation.page_icon,
                    }}
                    style={styles.imageStyle}
                  />
                ) : (
                  <Icon name={'home'} size={25} />
                )}

                <Text
                  style={[
                    styles.labelStyle,
                    selectedNavigation?.id === tabNavigation.id
                      ? {color: primaryColor, ...f.fontWeightMedium}
                      : {},
                  ]}
                  numberOfLines={1}>
                  {tabNavigation.name}
                </Text>
              </TouchableOpacity>
            );
          })}
          {/* <TouchableOpacity
            onPress={() => {
              NavigationService.pushToScreen(ScreenID.Reminders);
            }}
            style={[l.px5, l.py10, l.flex, l.justifyCtr, l.alignCtr]}>
            <FastImage
              source={require('../assets/images/ReminderIcon.png')}
              style={styles.imageStyle}
            />
            <Text style={[styles.labelStyle]} numberOfLines={1}>
              {'Erinnerungen'}
            </Text>
          </TouchableOpacity> */}
        </View>
      )}
    </>
  );
};

const TabsNavigation = () => {
  const dispatch = useAppDispatch();
  const drawerNavigations = useAppSelector(DrawerNavigationSelector());
  const selectedNavigation = useAppSelector(SelectedNavigationSelector());
  const highlitedDrawerNavigations =
    getHighlightedDrawerNavigations(drawerNavigations);

  // clear data before navigation
  useEffect(() => {
    // dispatch(resetEventsList());
    // dispatch(resetNewsList());
    // dispatch(resetCoursesList());
  }, [selectedNavigation.id]);

  return (
    <Tab.Navigator
      tabBar={props => (
        <MyTabBar tabNavigations={highlitedDrawerNavigations} />
      )}>
      <Tab.Screen component={Dashboard} name={'Tab-Dashboard'} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  labelStyle: {
    ...t.p,
    ...l.mt5,
    color: c.black200,
    // fontSize:0,
    // display:'none'
  },
  imageStyle: {
    width: 25,
    height: 25,
    ...l.mx10,
  },
});

export default TabsNavigation;
