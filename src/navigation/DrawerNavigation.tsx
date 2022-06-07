import React, {useCallback, useEffect, useRef, useState} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Dimensions,
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
  setSelectedNavigation,
  SettingsSelector,
} from '../store/Configuration';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {c, f, l, t} from '../styles/shared';
import {DrawerNavigation as DrawerNavigationType} from '../types/responses/SettingResponseType';
import Collapsible from 'react-native-collapsible';
import NavigationService from '../services/NavigationService';
import {usePrimaryStyles} from '../hooks/useThemeStyles';
import Text from '../components/Text';
import {resetCoursesList} from '../store/Course';
import {fetchLogout, FetchLogoutPrefix, IsAuthSelector} from '../store/Auth';
import {ScreenID} from './types';
import TabsNavigation from './BottomTabsNavigation';
import {resetNewsList} from '../store/News';
import {resetEventsList} from '../store/Events';
import {openLink} from '../components/Browser';
import {ScrollView} from 'react-native-gesture-handler';
import Input from '../components/FormControls/Input';

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(IsAuthSelector());
  const drawernavigations = useAppSelector(DrawerNavigationSelector());
  const selectedNavigation = useAppSelector(SelectedNavigationSelector());
  const settings = useAppSelector(SettingsSelector());

  const logoPath = useAppSelector(state => {
    return state.configuration.logo_color_ci?.logo_app_full_path;
  });
  const primaryColor = usePrimaryStyles().color;

  // refs
  const firstRender = useRef(true);
  // state
  const [collapsedConfig, setCollapsedConfig] = useState({});
  const [expandSelectedNavigation, setExapndSelectednavigation] =
    useState(false);
  const [appSearchText, setAppSearchText] = useState('');

  const handleNavigationPress = (drawernavigation: DrawerNavigationType) => {
    NavigationService.closeDrawer();
    if (drawernavigation.link_type === 'link') {
      if (drawernavigation.full_url) {
        openLink(drawernavigation.full_url);
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

  const onLogoutSuccess = useCallback(() => {
    NavigationService.closeDrawer();
    NavigationService.resetToScreen(ScreenID.Login);
  }, []);

  useThunkCallbackAction(FetchLogoutPrefix, onLogoutSuccess, onLogoutSuccess);

  const rendermenu = (
    drawernavigation: DrawerNavigationType,
    children: Array<DrawerNavigationType>,
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
                t.h5,
                isChildren ? {...l.py10} : {},
              ]}>
              {drawernavigation.name}
            </Text>
          </TouchableOpacity>
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
        </View>
        <Collapsible collapsed={isCollapsed}>
          {renderListItems(children)}
        </Collapsible>
      </View>
    );
  };

  const renderListItems = (items: Array<DrawerNavigationType>) => {
    return (
      <View>
        {items.map((item, i) => {
          return (
            <View style={{...l.pt20, ...l.pl20}} key={i}>
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
    const ratio = win.width / 541; //541 is actual image width
    return (
      <View style={{flex: 1}}>
        <View style={{...l.px10, ...l.mt10, flexDirection: 'row'}}>
          <FastImage
            source={{uri: logoPath}}
            style={{height: 100 * ratio, width: 250}}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>

        <View style={[l.px10, l.py15]}>
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
        </View>

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
    drawernavigation: DrawerNavigationType,
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
            t.h5,
            // isChildren ? {...l.py5} : {},
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
      drawerContent={props => {
        return (
          <SafeAreaView>
            <ScrollView
              bounces={false}
              style={{
                height: '100%',
              }}
              contentContainerStyle={{
                flexGrow: 1,
              }}>
              <View style={{flex: 1}}>
                {/* navigations */}
                {renderDrawerNavigations()}

                <View>
                  {/* Terms of use */}
                  <TouchableOpacity
                    style={[l.flexRow, l.alignCtr, l.justifyBtw, l.p20]}
                    onPress={() => {
                      Linking.openURL('https://www.nlt.de/impressum/');
                    }}>
                    <Text style={[t.h5]}>{'Impressum'}</Text>
                  </TouchableOpacity>

                  {/* Privacy Policy */}
                  <TouchableOpacity
                    style={[l.flexRow, l.alignCtr, l.justifyBtw, l.p20]}
                    onPress={() => {
                      Linking.openURL(
                        'https://www.nlt.de/datenschutzerklaerung/',
                      );
                    }}>
                    <Text style={[t.h5]}>{'Datenschutzbedingungen'}</Text>
                  </TouchableOpacity>
                </View>

                {settings?.sign_in && (
                  <View>
                    {/* Profile */}
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

                    {/* register */}
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

                    {/* signout */}
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
                )}
                {/* default navogations */}
              </View>
            </ScrollView>
          </SafeAreaView>
        );
      }}>
      <Drawer.Screen name="Dashboard" component={TabsNavigation} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  navigationItemContainer: {
    ...l.p20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
});

export default DrawerNavigation;
