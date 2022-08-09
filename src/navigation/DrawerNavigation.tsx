import React, {useCallback, useEffect, useRef, useState} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Dimensions,
  ScrollView,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialIcons';

// custom
import {
  useAppDispatch,
  useAppSelector,
  useThunkCallbackAction,
} from '../hooks/useRedux';
import {
  DrawerNavigationSelector,
  fetchDashboardSettings,
  SelectedNavigationSelector,
  setAppTheme,
  setSelectedNavigation,
  SettingsSelector,
  ThemeSelector,
} from '../store/Configuration';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {c, f, l, t} from '../styles/shared';
import Collapsible from 'react-native-collapsible';
import NavigationService from '../services/NavigationService';
import {usePrimaryStyles} from '../hooks/useThemeStyles';
import Text from '../components/Text';
import {resetCoursesList} from '../store/Course';
import {fetchLogout, FetchLogoutPrefix, IsAuthSelector} from '../store/Auth';
import {ScreenID} from './types';
import TabsNavigation from './BottomTabsNavigation';
import {openLink} from '../components/Browser';

import {NavigationType} from '../types/responses/NavigationsResponseType';
import {Switch} from 'react-native-gesture-handler';
import ToggleSwitch from 'toggle-switch-react-native';
import {useContainerStyles} from '../styles/elements';
import {useColors} from '../styles/shared/Colors';
import Checkbox from '../components/FormControls/Checkbox';

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(IsAuthSelector());
  const drawernavigations = useAppSelector(
    DrawerNavigationSelector(),
  ) as NavigationType[];
  const selectedNavigation = useAppSelector(SelectedNavigationSelector());
  const settings = useAppSelector(SettingsSelector());
  const appTheme = useAppSelector(ThemeSelector());

  const logoPath =
    appTheme === 'dark'
      ? settings?.main_logo_monochrome_url
      : settings?.main_logo_url;
  const primaryColor = usePrimaryStyles().color;
  const containerStyles = useContainerStyles();

  // refs
  const firstRender = useRef(true);
  // state
  const [collapsedConfig, setCollapsedConfig] = useState({});
  const [expandSelectedNavigation, setExapndSelectednavigation] =
    useState(false);
  const [appSearchText, setAppSearchText] = useState('');

  const handleNavigationPress = (drawernavigation: NavigationType) => {
    NavigationService.closeDrawer();
    if (drawernavigation.page_type === 'link') {
      if (drawernavigation.link_url) {
        Linking.openURL(drawernavigation.link_url);
        // openLink(drawernavigation.link_url);
      }
    } else {
      if (selectedNavigation?.id !== drawernavigation.id) {
        dispatch(fetchDashboardSettings(drawernavigation.id));
        dispatch(
          setSelectedNavigation({
            id: drawernavigation.id,
            name: drawernavigation.name,
          }),
        );
      }
    }
  };

  // useEffect(() => {
  //   if (!firstRender.current) {
  //     setExapndSelectednavigation(true);
  //   }
  // }, [selectedNavigationID]);

  useEffect(() => {
    drawernavigations.map(drawernavigation => {
      if (drawernavigation.default_page) {
        dispatch(
          setSelectedNavigation({
            id: drawernavigation.id,
            name: drawernavigation.name,
          }),
        );
      }
    });

    return () => {
      setCollapsedConfig({});
    };
  }, []);

  const logoutUser = () => {
    NavigationService.closeDrawer();
    dispatch(fetchLogout());
  };
  const goToLogin = () => {
    NavigationService.pushToScreen(ScreenID.Login);
  };
  const goToCheckout = () => {
    NavigationService.pushToScreen(ScreenID.Checkout);
  };
  const goToProfile = () => {
    NavigationService.pushToScreen(ScreenID.Profile);
  };
  const gotoSettings = () => {
    NavigationService.pushToScreen(ScreenID.Settings);
  };

  const onLogoutSuccess = useCallback(() => {
    NavigationService.closeDrawer();
    NavigationService.resetToScreen(ScreenID.Login);
  }, []);

  const goToLawTextDetail = (id: number) => {
    NavigationService.pushToScreen(ScreenID.LegalTextDetail, {
      id,
    });
  };

  useThunkCallbackAction(FetchLogoutPrefix, onLogoutSuccess, onLogoutSuccess);

  const rendermenu = (
    drawernavigation: NavigationType,
    children: Array<NavigationType>,
    index: number,
    isChildren?: boolean,
  ) => {
    let isChildNavigationSelected;
    children.map((c1, i) => {
      if (selectedNavigation?.id === c1.id) {
        isChildNavigationSelected = true;
      } else if (c1.children && c1.children.length > 0) {
        c1.children.map(c2 => {
          if (selectedNavigation?.id === c2.id) {
            isChildNavigationSelected = true;
          }
        });
      }
    });

    let isCollapsed =
      // @ts-ignore
      !collapsedConfig[drawernavigation.id];

    // isCollapsed = isCollapsed
    //   ? expandSelectedNavigation
    //     ? !isChildNavigationSelected
    //     : isCollapsed
    //   : false;

    return (
      <View key={index}>
        <View
          style={[
            {
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            },
          ]}>
          <TouchableOpacity
            style={[l.flex]}
            onPress={() => {
              handleNavigationPress(drawernavigation);
            }}>
            <Text
              style={[
                selectedNavigation?.id === drawernavigation.id
                  ? {
                      color: primaryColor,
                      ...f.fontWeightMedium,
                    }
                  : {},
                t.h5SM,
                f.fontWeightMedium,
                isChildren ? {...l.py10} : {},
              ]}>
              {drawernavigation.name}
            </Text>
          </TouchableOpacity>
          {drawernavigation.children && drawernavigation.children.length > 0 && (
            <TouchableOpacity
              style={[l.pl10]}
              onPress={() => {
                setExapndSelectednavigation(false);
                const obj = {
                  ...collapsedConfig,
                  [drawernavigation.id]:
                    // @ts-ignore
                    !collapsedConfig[drawernavigation.id],
                };
                setCollapsedConfig(obj);
              }}>
              <Icon color={c.black400} name={'arrow-drop-down'} size={20} />
            </TouchableOpacity>
          )}
        </View>
        <Collapsible collapsed={isCollapsed}>
          {renderListItems(children)}
        </Collapsible>
      </View>
    );
  };

  const renderListItems = (items: Array<NavigationType>) => {
    return (
      <View style={[l.mt10, l.ml30]}>
        {items.map((item, i) => {
          return (
            <View style={[l.mt10, !item.children ? l.mb10 : null]} key={i}>
              {item.children ? (
                <>{rendermenu(item, item.children, i, true)}</>
              ) : (
                <>{renderMenuItemText(item, true)}</>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  const onAllSearchPress = (searchText: string) => {
    NavigationService.pushToScreen(ScreenID.AppSearch, {
      appSearchText: searchText,
    });
  };

  const renderDrawerNavigations = () => {
    const win = Dimensions.get('window');
    const ratio = win.width / 400;
    // const colors = useColors();

    return (
      <View style={{flex: 1}}>
        <View
          style={[
            l.px20,
            l.my10,
            l.pb10,
            l.flexRow,
            logoPath
              ? {borderBottomWidth: 1, borderBottomColor: c.grey400}
              : {},
          ]}>
          {logoPath ? (
            <>
              <FastImage
                source={{uri: logoPath}}
                style={{
                  height: 80 * ratio,
                  width: '100%',
                  // borderWidth: 1,
                  ...l.flexRow,
                  ...l.justifyEnd,
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
            </>
          ) : null}
        </View>

        {/* <View style={[l.px10, l.py15]}>
          <Input
            type={'search'}
            onClearSearch={() => {
              setAppSearchText('');
            }}
            widgetStyles={{
              container: {...l.flex, marginBottom: 0},
              wrapper: {backgroundColor: c.white},
            }}
            placeholder={'Suchbegriff eingeben'}
            leftIcon={{iconName: 'search'}}
            onChangeText={text => {
              setAppSearchText(text);
            }}
            value={appSearchText}
            returnKeyType={'search'}
            onSubmitEditing={() => {
              onAllSearchPress(appSearchText);
            }}
            onBlur={() => {
              setAppSearchText('');
            }}
          />
        </View> */}

        <View>
          {drawernavigations.map((drawernavigation, i) => {
            return (
              <View style={styles.navigationItemContainer} key={i}>
                {drawernavigation.children ? (
                  <>
                    {rendermenu(drawernavigation, drawernavigation.children, i)}
                  </>
                ) : (
                  <>{renderMenuItemText(drawernavigation)}</>
                )}
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderMenuItemText = (
    drawernavigation: NavigationType,
    isChildren?: boolean,
  ) => {
    return (
      <TouchableOpacity
        onPress={() => {
          handleNavigationPress(drawernavigation);
        }}>
        <Text
          style={[
            selectedNavigation?.id === drawernavigation.id
              ? {
                  color: primaryColor,
                  ...f.fontWeightMedium,
                }
              : {},
            t.h5SM,
            f.fontWeightMedium,
          ]}>
          {drawernavigation.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const {top, bottom} = useSafeAreaInsets();

  return (
    <Drawer.Navigator
      screenOptions={{
        swipeEnabled: true,
        unmountOnBlur: true,
      }}
      drawerPosition={'right'}
      drawerContent={props => {
        return (
          <View style={[containerStyles]}>
            <SafeAreaView>
              <ScrollView
                bounces={false}
                style={{
                  height: '100%',
                  // backgroundColor: 'blue',
                }}
                contentContainerStyle={{
                  flexGrow: 1,
                }}>
                <View
                  style={{
                    flex: 1,
                  }}>
                  {/* navigations */}
                  {renderDrawerNavigations()}

                  {/* legal texts */}
                  <View style={{borderTopWidth: 1, borderTopColor: c.grey400}}>
                    {/* Impressum */}
                    {settings?.impression_id ? (
                      <TouchableOpacity
                        style={[l.flexRow, l.alignCtr, l.justifyBtw, l.p20]}
                        onPress={() => {
                          NavigationService.closeDrawer();
                          // @ts-ignore
                          goToLawTextDetail(settings?.impression_id);
                        }}>
                        <Text style={[t.h5SM, f.fontWeightMedium]}>
                          {settings?.impression_text}
                        </Text>
                      </TouchableOpacity>
                    ) : null}

                    {/* Datenschutz */}
                    {settings?.data_privacy_id ? (
                      <TouchableOpacity
                        style={[l.flexRow, l.alignCtr, l.justifyBtw, l.p20]}
                        onPress={() => {
                          NavigationService.closeDrawer();
                          // @ts-ignore
                          goToLawTextDetail(settings?.data_privacy_id);
                        }}>
                        <Text style={[t.h5SM, f.fontWeightMedium]}>
                          {settings?.data_privacy_text}
                        </Text>
                      </TouchableOpacity>
                    ) : null}

                    {/* Terms of use */}
                    {settings?.terms_of_use_id ? (
                      <TouchableOpacity
                        style={[l.flexRow, l.alignCtr, l.justifyBtw, l.p20]}
                        onPress={() => {
                          NavigationService.closeDrawer();
                          // @ts-ignore
                          goToLawTextDetail(settings?.terms_of_use_id);
                        }}>
                        <Text style={[t.h5SM, f.fontWeightMedium]}>
                          {settings?.terms_of_use_text}
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>

                  {/* Settings */}
                  <TouchableOpacity
                    style={[l.flexRow, l.alignCtr, l.p20]}
                    onPress={() => {
                      NavigationService.closeDrawer();
                      gotoSettings();
                    }}>
                    <Text style={[t.h5SM, f.fontWeightMedium]}>
                      Einstellungen
                    </Text>

                    {/* <ToggleSwitch
                      // @ts-ignore
                      isOn={appTheme === 'dark'}
                      onColor={primaryColor}
                      offColor={c.grey50}
                      size="medium"
                      onToggle={isOn => {
                        dispatch(setAppTheme(isOn ? 'dark' : 'light'));
                      }}
                    /> */}
                  </TouchableOpacity>

                  {/* {settings?.sign_in && (
                  <View>
                    {isAuth && (
                      <TouchableOpacity
                        style={[
                          l.flexRow,
                          l.alignCtr,
                          l.justifyBtw,
                          l.p20,
                          styles.navigationItemContainer,
                        ]}
                        onPress={goToProfile}>
                        <Text style={[t.h5]}>{'Benutzerkonto'}</Text>
                        <Icon
                          size={24}
                          name={'person-outline'}
                          color={c.black400}
                        />
                      </TouchableOpacity>
                    )}
                    {!isAuth && (
                      <TouchableOpacity
                        style={[l.flexRow, l.alignCtr, l.justifyBtw, l.p20]}
                        onPress={goToCheckout}>
                        <Text style={[t.h5]}>{'Benutzerkonto erstellen'}</Text>
                        <Icon
                          size={20}
                          name={'app-registration'}
                          color={c.black400}
                        />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={[l.flexRow, l.alignCtr, l.justifyBtw, l.p20]}
                      onPress={isAuth ? logoutUser : goToLogin}>
                      <Text style={[t.h5]}>
                        {isAuth ? 'Abmelden' : 'Anmelden'}
                      </Text>
                      <Icon
                        size={20}
                        name={isAuth ? 'logout' : 'login'}
                        color={c.black400}
                      />
                    </TouchableOpacity>
                  </View>
                )} */}
                  {/* default navogations */}
                </View>
              </ScrollView>
            </SafeAreaView>
          </View>
        );
      }}>
      <Drawer.Screen name="Dashboard" component={TabsNavigation} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  navigationItemContainer: {
    ...l.p20,
  },
});

export default DrawerNavigation;
