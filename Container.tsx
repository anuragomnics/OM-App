import React, {useEffect, useRef, useState, useCallback} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import {ActionSheetProvider} from '@expo/react-native-action-sheet';
import {Appearance, StatusBar, View} from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import 'moment/min/locales';

// custom
import {Store} from './src/store/index';
import AppNavigation from './src/navigation/AppNavigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AppFonts, {useFontStyle} from './src/components/AppFonts';
import {
  useAppDispatch,
  useAppSelector,
  useThunkCallbackAction,
} from './src/hooks/useRedux';
import {
  fetchAppSettings,
  fetchAppSettingsNew,
  FetchAppSettingsPrefix,
  fetchCheckoutSettings,
  fetchAppNavigations,
  LoadAppFontsPrefix,
  ThemeSelector,
  setAppTheme,
  ThemeSetttingTypeSelector,
} from './src/store/Configuration';
import {StatusSelector} from './src/store/Status';
import {
  fetchRegisterNewDevice,
  IsAuthSelector,
  RegisterNewDevicePrefix,
} from './src/store/Auth';
import IAP from 'react-native-iap';
import {endIAPConnection, useInitIAP} from './src/hooks/useIAP';
import {PaymentService} from './src/services/PaymentService';
import {c, f, l} from './src/styles/shared';
import {fetchGetMasterData} from './src/store/MasterData';
import AppNotification from './src/notifications/AppNotification';
import VideoPlayer from './src/components/VideoPlayerModal';
import {VideoPlayerContentSelector} from './src/store/News';
import {useContainerStyles} from './src/styles/elements';
import moment from 'moment';

Icon.loadFont();

const Container = () => {
  const dispatch = useAppDispatch();
  const {error, pending} = useAppSelector(StatusSelector(LoadAppFontsPrefix));
  const isAuth = useAppSelector(IsAuthSelector());
  const VideoPlayerContent = useAppSelector(VideoPlayerContentSelector());
  const appTheme = useAppSelector(ThemeSelector());
  const containerStyles = useContainerStyles();
  const appThemSettingType = useAppSelector(ThemeSetttingTypeSelector());
  // useInitIAP();

  // refs
  const firstRender = useRef(true);

  //   state
  const [isGettingConfig, setGettingConfig] = useState(true);
  const [isLoadingFont, setLoadingFont] = useState(true);
  const [isRegisterNewDevice, setRegisteringNewDevice] = useState(true);
  const [isErrorConfig, setErrorConfig] = useState(false);
  const [isErrorFont, setErrorFont] = useState(false);
  const [isErrorNewDevice, setErrorNewDevice] = useState(false);

  const updateAppTheme = (theme: string) => {
    if (theme === 'dark') {
      dispatch(setAppTheme('dark'));
    } else {
      dispatch(setAppTheme('light'));
    }
  };

  useEffect(() => {
    if (appThemSettingType === 'system') {
      updateAppTheme(Appearance.getColorScheme() || 'light');
    }

    dispatch(fetchAppSettingsNew());
    dispatch(fetchAppNavigations());

    moment.locale('de');

    // dispatch(fetchAppSettings());
    // dispatch(fetchCheckoutSettings());
    // dispatch(fetchGetMasterData());
    {
      // !isAuth && dispatch(fetchRegisterNewDevice());
    }
  }, []);

  const onLoadConfigSuccess = useCallback(() => {
    setGettingConfig(false);
  }, []);

  const onLoadFontSuccess = useCallback(() => {
    setLoadingFont(false);
  }, []);

  const onRegisterNewDeviceSuccess = useCallback(() => {
    setRegisteringNewDevice(false);
  }, []);

  const onLoadConfigError = useCallback(() => {
    setErrorConfig(true);
  }, []);

  const onLoadFontError = useCallback(() => {
    setErrorFont(true);
  }, []);

  const onRegisterNewDeviceError = useCallback(() => {
    setErrorNewDevice(true);
  }, []);

  useThunkCallbackAction(
    FetchAppSettingsPrefix,
    () => {
      onLoadConfigSuccess();
    },
    () => {
      onLoadConfigError();
    },
  );
  useThunkCallbackAction(
    RegisterNewDevicePrefix,
    () => {
      onRegisterNewDeviceSuccess();
    },
    () => {
      onRegisterNewDeviceError();
    },
  );

  // close spash when API is completed
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (!firstRender.current) {
      if (!pending) {
        RNBootSplash.hide();
      }
    }
  }, [pending]);

  const fontStyle = useFontStyle();

  const toastConfig = {
    // @ts-ignore
    success: ({text1, text2, props, ...rest}) => (
      <BaseToast
        {...rest}
        style={{borderLeftColor: 'green'}}
        contentContainerStyle={{padding: 10}}
        text1Style={{
          ...fontStyle,
          fontSize: 13,
          ...f.fontWeightMedium,
        }}
        text1={text1}
        // @ts-ignore
        text2Style={{
          ...fontStyle,
          fontSize: 12,
        }}
        text2={text2}
      />
    ),
    // @ts-ignore
    error: ({text1, text2, props, ...rest}) => (
      <ErrorToast
        {...rest}
        style={{borderLeftColor: c.red800}}
        contentContainerStyle={{padding: 10}}
        text1Style={{
          ...fontStyle,
          fontSize: 13,
          ...f.fontWeightMedium,
        }}
        text1={text1}
        // @ts-ignore
        text2Style={{
          ...fontStyle,
          fontSize: 12,
        }}
        text2={text2}
      />
    ),
  };

  const isLoading = isGettingConfig || isLoadingFont;

  return (
    <Provider store={Store}>
      <SafeAreaProvider>
        <View style={[containerStyles]}>
          <AppFonts onError={onLoadFontError} onSuccess={onLoadFontSuccess} />
          <StatusBar
            translucent={true}
            backgroundColor="transparent"
            barStyle={appTheme === 'dark' ? 'light-content' : 'dark-content'}
          />
          {!isLoading && (
            <ActionSheetProvider>
              <>
                {VideoPlayerContent ? <VideoPlayer /> : null}
                <AppNotification />
                <AppNavigation />
                <Toast config={toastConfig} ref={ref => Toast.setRef(ref)} />
              </>
            </ActionSheetProvider>
          )}
        </View>
      </SafeAreaProvider>
    </Provider>
  );
};

export default Container;
