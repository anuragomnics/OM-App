import React, {FC, useEffect, useRef, useState} from 'react';
import {
  View,
  Image,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';

// styles
import styles from './styles';
// custom
import Header from '../../components/Header';
import {ContainerStyles} from '../../styles/elements';
import LoginForm from './components/LoginForm';
import FormContainer from '../../components/FormContainer';
import {useAppDispatch, useThunkCallbackAction} from '../../hooks/useRedux';
import {fetchLogin, FetchLoginPrefix, fetchProfile} from '../../store/Auth';
import {SignInParams} from '../../types/request';
import {usePrimaryStyles} from '../../hooks/useThemeStyles';
import Text from '../../components/Text';
import NavigationService from '../../services/NavigationService';
import {ScreenID} from '../../navigation/types';
import {useNavigation} from '@react-navigation/core';
import {f, t, l} from '../../styles/shared';
import CustomKeyboardAvoidingView from '../../components/CustomKeyboardAvoidingView';

const Login: FC<any> = () => {
  const dispatch = useAppDispatch();
  const {canGoBack} = useNavigation();
  const primaryColor = usePrimaryStyles().color;

  // state
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    if (loginSuccess) {
      NavigationService.resetToScreen(ScreenID.Main);
      dispatch(fetchProfile());
    }
  }, [loginSuccess]);

  const onFormSubmit = (values: SignInParams) => {
    dispatch(fetchLogin(values));
  };

  const onLoginSuccess = () => {
    setLoginSuccess(true);
  };

  const onSignup = () => {
    NavigationService.pushToScreen(ScreenID.Memberships);
  };

  useThunkCallbackAction(FetchLoginPrefix, onLoginSuccess);

  return (
    <View style={[ContainerStyles]}>
      <Header title={'Anmelden'} useBack={canGoBack()} />

      <CustomKeyboardAvoidingView>
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          {/* <Image
            style={styles.bannerImage}
            source={require('../../assets/images/banner_woman.png')}
          /> */}

          <View style={styles.wrapper}>
            <Text style={[styles.welcomeBack, usePrimaryStyles()?.textStyle]}>
              {'Willkommen zurück!'}
            </Text>
            <Text style={[t.h5, l.mt5]}>
              {'Bitte melden Sie sich zum Jahresprogramm hier an.'}
            </Text>
          </View>

          <FormContainer
            widgetStyles={{
              childContainer: styles.FormContainerWidgetContainer,
            }}>
            <LoginForm onFormSubmit={onFormSubmit} />

            <View style={[l.flexRow, l.justifyCtr, l.mt10]}>
              <Text>
                {'Sie sind noch nicht zum Jahresprogramm angemeldet? '}
                <Text
                  onPress={onSignup}
                  style={[{color: primaryColor}, f.fontWeightMedium]}>
                  {'Hier registrieren!'}
                </Text>
              </Text>
            </View>
          </FormContainer>
        </ScrollView>
      </CustomKeyboardAvoidingView>
    </View>
  );
};

export default Login;
