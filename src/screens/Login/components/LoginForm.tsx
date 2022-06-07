import React, {FC, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
// styles
import {c, t, f, l} from '../../../styles/shared';
// custom
import Input from '../../../components/FormControls/Input';
import Button from '../../../components/Button';
import Checkbox from '../../../components/FormControls/Checkbox';
import NavigationService from '../../../services/NavigationService';
import {SignInParams} from '../../../types/request';
import Text from '../../../components/Text';
import {usePrimaryStyles} from '../../../hooks/useThemeStyles';
import {useAppSelector} from '../../../hooks/useRedux';
import {StatusSelector} from '../../../store/Status';
import {FetchLoginPrefix} from '../../../store/Auth';
import {ScreenID} from '../../../navigation/types';
import FormError from '../../../components/FormError';

const initialValues: SignInParams = {
  username: '',
  password: '',
};

const validationSchema = Yup.object().shape({
  username: Yup.string().required(
    'Bitte geben Sie Ihren Benutzernamen ein or E-Mail-Adresse ein',
  ),
  password: Yup.string().required('Bitte geben Sie eine Passwort ein'),
});

interface Props {
  onFormSubmit?: (values: SignInParams) => void;
}

const LoginForm: React.FC<Props> = ({onFormSubmit}) => {
  const {error, pending} = useAppSelector(StatusSelector(FetchLoginPrefix));
  const primaryColor = usePrimaryStyles().color;

  // state
  const [secureTextEntry, setSecureTextEntry] = useState({
    password: true,
  });

  const gotoSignUp = () => {
    NavigationService.pushToScreen(ScreenID.Register);
  };

  const goToForgotpassword = () => {
    NavigationService.pushToScreen(ScreenID.ForgotPassword);
  };

  const onSubmit = (values: SignInParams) => {
    onFormSubmit?.(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}>
      {({
        errors,
        values,
        touched,
        handleChange,
        handleBlur,
        setFieldValue,
        handleSubmit,
      }) => (
        <>
          <FormError
            error={error}
            errorMessage={'Falscher Benutzername oder Passwort'}
          />

          <Input
            touched={touched.username}
            error={errors.username}
            onChangeText={handleChange('username')}
            value={values.username}
            onBlur={handleBlur('username')}
            placeholder={'Benutzername'}
            leftIcon={{iconName: 'email', iconColor: primaryColor}}
          />
          <Input
            touched={touched.password}
            error={errors.password}
            onChangeText={handleChange('password')}
            value={values.password}
            onBlur={handleBlur('password')}
            placeholder={'Passwort'}
            secureTextEntry={secureTextEntry.password}
            leftIcon={{iconName: 'lock', iconColor: primaryColor}}
            rightIcon={{
              iconName: secureTextEntry.password
                ? 'visibility'
                : 'visibility-off',
              iconColor: primaryColor,
            }}
            onRightIconPress={() => {
              setSecureTextEntry({password: !secureTextEntry.password});
            }}
          />

          <View style={styles.actionsContainer}>
            <Button
              theme={'simplePrimary'}
              title={'Passwort vergessen?'}
              onPress={goToForgotpassword}
            />
          </View>

          <Button
            theme={'primary'}
            title={'Anmelden'}
            onPress={handleSubmit}
            loading={pending}
            loadingTitle={'Anmelden'}
          />

          {/* <Text style={styles.footer}>
            {"Don't have an user account yet? "}
            <Text
              onPress={gotoSignUp}
              style={[usePrimaryStyles()?.textStyle, {...f.fontWeightMedium}]}>
              {'Sign up!'}
            </Text>
          </Text> */}
        </>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  actionsContainer: {
    ...l.flexRow,
    ...l.justifyEnd,
    ...l.alignCtr,
    ...l.mb20,
    // ...l.mt5,
  },
  remembermeContainer: {
    ...l.flexRow,
    ...l.alignCtr,
  },
  rememberme: {
    ...l.ml5,
  },
  footer: {
    textAlign: 'center',
    ...l.mt20,
  },
  loginError: {
    ...l.mb10,
    color: c.red800,
    // ...t.pSM,
  },
});

export default LoginForm;
