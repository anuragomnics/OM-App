import React, {Ref, useEffect, useRef, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

// custom
import {ScreenID, RootStackParams} from './types';
import Onboarding from './../screens/Onboarding';
import Login from './../screens/Login';
import Memberships from '../screens/Memberships';
import Register from '../screens/Register';
import NavigationService from '../services/NavigationService';
import Checkout from '../screens/Checkout';
import ForgotPassword from '../screens/Forgotpassword';
import ChangePassword from '../screens/ChangePassword';
import {useAppDispatch, useAppSelector} from '../hooks/useRedux';
import {SettingsSelector, onBoardingSelector} from '../store/Configuration';
import DrawerNavigation from './DrawerNavigation';
import TabNavigation from './BottomTabsNavigation';
import LegalTextDetail from '../screens/LegalTextDetail';
import {IsAuthSelector} from '../store/Auth';
import CourseDetails from '../screens/CourseDetails';
import AllCourses from '../screens/AllCourses';
import AllPosts from '../screens/AllPosts';
import AllEvents from '../screens/AllEvents';
import VideoPlayerModal from '../components/VideoPlayerModal';
import EventDetails from '../screens/EventDetails';
import PostDetails from '../screens/PostDetails';
import PostDetailsStyle2 from '../screens/PostDetails/PostDetailsStyle2';
import Profile from '../screens/Profile';
import SetNewPassword from '../screens/SetNewPassword';
import DeviceHelper from '../config/DeviceHelper';
import {PaymentService} from '../services/PaymentService';
import {Alert, View} from 'react-native';
import AppSearch from '../screens/AppSearch';
import Reminders from '../screens/Reminders';
import FullScreenImage from '../screens/FullScreenImage';
import Settings from '../screens/Settings';

const Stack = createStackNavigator<RootStackParams>();

const AppNavigation = () => {
  const isAuth = useAppSelector(IsAuthSelector());
  const settings = useAppSelector(SettingsSelector());
  const onBoarding = useAppSelector(onBoardingSelector());

  // ref
  const firstRender = useRef(true);
  const [hasSubscription, setHasUserSubscription] = useState(false);

  // useEffect(() => {
  //   if (firstRender.current) {
  //     firstRender.current = false;
  //     async function getActiveSubscription() {
  //       try {
  //         const subscriptionIds: string[] = [];
  //         onBoarding?.show_offer_memberships?.map((offerMembership, index) => {
  //           const product_id = DeviceHelper.isIOS
  //             ? offerMembership?.product_id_apple_pay
  //             : offerMembership?.product_id_google_pay;
  //           if (product_id) {
  //             subscriptionIds.push(product_id);
  //           }
  //         });
  //         const subscriptionPurchase =
  //           await PaymentService.getActiveSubscription(subscriptionIds);
  //         // @ts-ignore
  //         setHasUserSubscription(subscriptionPurchase ? true : false);
  //       } catch (error) {
  //         // @ts-ignore
  //         setHasUserSubscription(false);
  //       }
  //     }
  //     getActiveSubscription();
  //   } else {
  //     return;
  //   }
  // });

  const getInitialRouteName = () => {
    // if (isAuth || !settings?.sign_in || hasSubscription) {
    //   return ScreenID.Main;
    // }
    // if (onBoarding?.enabled) {
    //   return ScreenID.Onboarding;
    // }
    // return ScreenID.Login;
    return ScreenID.Main;
  };

  const createAppNavigations = () => {
    if (hasSubscription !== null) {
      return (
        <NavigationContainer ref={ref => (NavigationService.navigator = ref)}>
          <Stack.Navigator
            initialRouteName={getInitialRouteName()}
            screenOptions={{headerShown: false}}>
            <Stack.Screen name={ScreenID.Onboarding} component={Onboarding} />
            <Stack.Screen name={ScreenID.Login} component={Login} />
            <Stack.Screen name={ScreenID.Memberships} component={Memberships} />
            <Stack.Screen name={ScreenID.Register} component={Register} />
            <Stack.Screen name={ScreenID.Checkout} component={Checkout} />
            <Stack.Screen
              name={ScreenID.LegalTextDetail}
              component={LegalTextDetail}
            />
            <Stack.Screen
              name={ScreenID.ForgotPassword}
              component={ForgotPassword}
            />
            <Stack.Screen
              name={ScreenID.ChangePassword}
              component={ChangePassword}
            />

            <Stack.Screen name={ScreenID.Main} component={DrawerNavigation} />
            {/* <Stack.Screen name={ScreenID.Main} component={TabNavigation} /> */}
            <Stack.Screen
              name={ScreenID.CouseDetails}
              component={CourseDetails}
            />
            <Stack.Screen name={ScreenID.AllCourses} component={AllCourses} />
            <Stack.Screen name={ScreenID.PostDetails} component={PostDetails} />
            <Stack.Screen name={ScreenID.AllPosts} component={AllPosts} />
            <Stack.Screen
              name={ScreenID.EventDetails}
              component={EventDetails}
            />
            <Stack.Screen
              name={ScreenID.FullScreenImage}
              component={FullScreenImage}
            />

            <Stack.Screen name={ScreenID.AllEvents} component={AllEvents} />
            <Stack.Screen name={ScreenID.Profile} component={Profile} />
            <Stack.Screen
              name={ScreenID.SetNewPassword}
              component={SetNewPassword}
            />

            <Stack.Screen
              name={ScreenID.VideoPlayer}
              component={VideoPlayerModal}
            />
            <Stack.Screen name={ScreenID.AppSearch} component={AppSearch} />
            <Stack.Screen name={ScreenID.Reminders} component={Reminders} />
            <Stack.Screen name={ScreenID.Settings} component={Settings} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    } else {
      return <View />;
    }
  };

  return <>{createAppNavigations()}</>;
};

const MainNavigationComponent = () => {
  return (
    <>
      <DrawerNavigation />
    </>
  );
};

export default AppNavigation;
