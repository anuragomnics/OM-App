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

import FormContainer from '../../components/FormContainer';
import {useAppDispatch, useThunkCallbackAction} from '../../hooks/useRedux';
import {
  fetchLogin,
  FetchLoginPrefix,
  fetchLogout,
  fetchProfile,
  setNewPassword,
  SetNewPasswordPrefix,
} from '../../store/Auth';
import {SetNewPasswordParams, SignInParams} from '../../types/request';
import {usePrimaryStyles} from '../../hooks/useThemeStyles';
import Text from '../../components/Text';
import NavigationService from '../../services/NavigationService';
import {ScreenID} from '../../navigation/types';
import {useNavigation} from '@react-navigation/core';
import {f, t, l} from '../../styles/shared';
import CustomKeyboardAvoidingView from '../../components/CustomKeyboardAvoidingView';
import SetNewPasswordForm from './components/SetNewPasswordForm';
import Toast from 'react-native-toast-message';

const SetNewPassword: FC<any> = () => {
  const dispatch = useAppDispatch();
  const {canGoBack} = useNavigation();
  const primaryColor = usePrimaryStyles().color;

  const onFormSubmit = (values: SetNewPasswordParams) => {
    dispatch(setNewPassword(values));
  };

  // state
  const [newPasswordSuccess, setNewPasswordSuccess] = useState(false);

  useEffect(() => {
    if (newPasswordSuccess) {
      Toast.show({
        type: 'success',
        position: 'top',
        topOffset: 100,
        text1: 'Passwort erfolgreich geändert!',
        visibilityTime: 3000,
      });
    }
  }, [newPasswordSuccess]);

  const onSetNewPasswordSuccess = () => {
    setNewPasswordSuccess(true);
  };

  useThunkCallbackAction(SetNewPasswordPrefix, onSetNewPasswordSuccess);

  return (
    <View style={[ContainerStyles]}>
      <Header title={'Passwort ändern'} useBack={canGoBack()} />

      <CustomKeyboardAvoidingView>
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          <FormContainer
            widgetStyles={{
              childContainer: styles.FormContainerWidgetContainer,
            }}>
            <SetNewPasswordForm onFormSubmit={onFormSubmit} />
          </FormContainer>
        </ScrollView>
      </CustomKeyboardAvoidingView>
    </View>
  );
};

export default SetNewPassword;
