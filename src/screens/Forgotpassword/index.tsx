import React, {FC, useEffect, useState} from 'react';
import {View, ScrollView, Text, Image, StyleSheet} from 'react-native';
import {Formik} from 'formik';
// styles
import {t, f, l, c} from '../../styles/shared';
// custom
import Header from '../../components/Header';
import {ContainerStyles} from '../../styles/elements';
import FormContainer from '../../components/FormContainer';
import ChangePasswordForm from '../ChangePassword/components/ChangePasswordForm';
import ResetPasswordEmailForm from './components/ResetPasswordEmailForm';
import {
  sendResetPasswordParams,
  updatePasswordParams,
} from '../../types/request';
import {
  useAppDispatch,
  useAppSelector,
  useThunkCallbackAction,
} from '../../hooks/useRedux';
import {
  fetchResetPasswordCode,
  FetchResetPasswordCodePrefix,
  updatePassword,
  UpdatePasswordPrefix,
} from '../../store/Auth';
import {StatusSelector} from '../../store/Status';
import CustomKeyboardAvoidingView from '../../components/CustomKeyboardAvoidingView';
import Toast from 'react-native-toast-message';
import NavigationService from '../../services/NavigationService';
import {ScreenID} from '../../navigation/types';

const ForgotPassword: FC<any> = () => {
  const dispatch = useAppDispatch();

  // state
  const [ViewType, setViewType] = useState('email');
  const [passwordResetSuccess, SetPasswordResetSuccess] = useState(false);

  const onEnterCodePress = () => {
    setViewType('code');
  };
  const onSendCodePress = (values: sendResetPasswordParams) => {
    dispatch(fetchResetPasswordCode(values));
  };
  const onUpdatePasswordPress = (values: updatePasswordParams) => {
    dispatch(updatePassword(values));
  };

  useThunkCallbackAction(FetchResetPasswordCodePrefix, () => {
    setViewType('code');
  });

  useThunkCallbackAction(UpdatePasswordPrefix, () => {
    SetPasswordResetSuccess(true);
  });

  useEffect(() => {
    if (passwordResetSuccess) {
      Toast.show({
        type: 'success',
        position: 'top',
        topOffset: 100,
        text1: 'Passwort erfolgreich geändert!',
        visibilityTime: 3000,
      });
      NavigationService.goBack();
    }
  }, [passwordResetSuccess]);

  return (
    <View style={[ContainerStyles]}>
      <Header title={'Passwort vergessen'} useBack />

      <CustomKeyboardAvoidingView style={{flex: 1}}>
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          <FormContainer
            widgetStyles={{
              childContainer: styles.FormContainerWidgetContainer,
            }}>
            {ViewType === 'email' ? (
              <ResetPasswordEmailForm
                onEnterCodePress={onEnterCodePress}
                onFormSubmit={onSendCodePress}
              />
            ) : (
              <ChangePasswordForm onFormSubmit={onUpdatePasswordPress} />
            )}
          </FormContainer>
        </ScrollView>
      </CustomKeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {},
  FormContainerWidgetContainer: {
    ...l.p20,
  },
  bannerImg: {
    ...l.fullWidth,
    height: 220,
  },
});

export default ForgotPassword;
