import React, {FC, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
// styles
import {c, t, f, l} from '../../../styles/shared';
// custom
import Input from '../../../components/FormControls/Input';
import Button from '../../../components/Button';
import {SetNewPasswordParams, SignInParams} from '../../../types/request';
import {useAppSelector} from '../../../hooks/useRedux';
import {StatusSelector} from '../../../store/Status';
import {SetNewPasswordPrefix} from '../../../store/Auth';
import FormError from '../../../components/FormError';
import {SharedValidationSchema} from '../../../utils/ValidationSchemaUtil';
import {usePrimaryStyles} from '../../../hooks/useThemeStyles';

const initialValues: SetNewPasswordParams = {
  current_password: '',
  password: '',
  password_confirmation: '',
};

const validationSchema = Yup.object().shape({
  current_password: Yup.string().required('Bitte geben Sie Passwort ändern'),
  password: SharedValidationSchema.password,
  password_confirmation: SharedValidationSchema.password_confirmation,
});

interface Props {
  onFormSubmit?: (values: SetNewPasswordParams) => void;
}

const SetNewPasswordForm: React.FC<Props> = ({onFormSubmit}) => {
  const {error, pending} = useAppSelector(StatusSelector(SetNewPasswordPrefix));
  const primaryColor = usePrimaryStyles().color;

  // state
  const [secureTextEntry, setSecureTextEntry] = useState({
    current_password: true,
    password: true,
    password_confirmation: true,
  });

  const onSubmit = (values: SetNewPasswordParams) => {
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
            errorMessage={'Falsche Angaben. Bitte versuchen Sie es erneut'}
          />

          <Input
            touched={touched.current_password}
            error={errors.current_password}
            onChangeText={handleChange('current_password')}
            value={values.current_password}
            onBlur={handleBlur('current_password')}
            placeholder={'Aktuelles Passwort'}
            secureTextEntry={secureTextEntry.current_password}
            rightIcon={{
              iconName: secureTextEntry.current_password
                ? 'visibility'
                : 'visibility-off',
              iconColor: primaryColor,
            }}
            onRightIconPress={() => {
              setSecureTextEntry({
                ...secureTextEntry,
                current_password: !secureTextEntry.current_password,
              });
            }}
          />
          <Input
            touched={touched.password}
            error={errors.password}
            onChangeText={handleChange('password')}
            value={values.password}
            onBlur={handleBlur('password')}
            placeholder={'neues Passwort'}
            secureTextEntry={secureTextEntry.password}
            rightIcon={{
              iconName: secureTextEntry.password
                ? 'visibility'
                : 'visibility-off',
              iconColor: primaryColor,
            }}
            onRightIconPress={() => {
              setSecureTextEntry({
                ...secureTextEntry,
                password: !secureTextEntry.password,
              });
            }}
          />
          <Input
            touched={touched.password_confirmation}
            error={errors.password_confirmation}
            onChangeText={handleChange('password_confirmation')}
            value={values.password_confirmation}
            onBlur={handleBlur('password_confirmation')}
            placeholder={'neues Passwort wiederholen'}
            secureTextEntry={secureTextEntry.password_confirmation}
            rightIcon={{
              iconName: secureTextEntry.password_confirmation
                ? 'visibility'
                : 'visibility-off',
              iconColor: primaryColor,
            }}
            onRightIconPress={() => {
              setSecureTextEntry({
                ...secureTextEntry,
                password_confirmation: !secureTextEntry.password_confirmation,
              });
            }}
          />

          <Button
            theme={'primary'}
            title={'Speichern'}
            onPress={handleSubmit}
            loading={pending}
            loadingTitle={'Speichern'}
          />
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

export default SetNewPasswordForm;
