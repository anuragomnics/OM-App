import React, {FC, useState} from 'react';
import {View, ScrollView, Image, StyleSheet} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
// styles
import {t, f, l, c} from '../../../styles/shared';
// custom
import Input from '../../../components/FormControls/Input';
import Button from '../../../components/Button';
import {SharedValidationSchema} from '../../../utils/ValidationSchemaUtil';
import Text from '../../../components/Text';
import {updatePasswordParams, SignInParams} from '../../../types/request';
import {useAppSelector} from '../../../hooks/useRedux';
import {StatusSelector} from '../../../store/Status';
import {UpdatePasswordPrefix} from '../../../store/Auth';
import FormError from '../../../components/FormError';
import {usePrimaryStyles} from '../../../hooks/useThemeStyles';

const validationSchema = yup.object().shape({
  code: SharedValidationSchema.resetPasswordCode,
  password: SharedValidationSchema.password,
  password_confirmation: SharedValidationSchema.password_confirmation,
});

interface Props {
  onFormSubmit?: (values: updatePasswordParams) => void;
}

const ChangePasswordForm: FC<Props> = ({onFormSubmit}) => {
  const {error, pending} = useAppSelector(StatusSelector(UpdatePasswordPrefix));
  const primaryColor = usePrimaryStyles().color;

  // state
  const [secureTextEntry, setSecureTextEntry] = useState({
    password: true,
    password_confirmation: true,
  });

  const onSubmit = (values: updatePasswordParams) => {
    onFormSubmit?.(values);
  };

  return (
    <View>
      <Text style={[styles.header]}>
        {
          'Wir haben Ihnen einen Rücksetz-Code an die angegebene E-Mail-Adresse gesendet.'
        }
      </Text>
      <Formik
        initialValues={{
          code: '',
          password: '',
          password_confirmation: '',
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}>
        {({
          errors,
          values,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <>
            <FormError
              error={error}
              errorMessage={
                'Beim Aktualisieren Ihres Passworts ist ein Problem aufgetreten. Bitte versuchen Sie es erneut'
              }
            />
            <Input
              touched={touched.code}
              error={errors.code}
              onChangeText={handleChange('code')}
              value={values.code?.toString()}
              onBlur={handleBlur('code')}
              placeholder={'Rücksetz-Code'}
            />
            <Input
              touched={touched.password}
              error={errors.password}
              onChangeText={handleChange('password')}
              value={values.password}
              onBlur={handleBlur('password')}
              placeholder={'Passwort'}
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
              placeholder={'Passwort wiederholen'}
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
              loadingTitle={'Aktualisiere Passwort'}
            />
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    textAlign: 'center',
    ...l.mb20,
    ...l.px20,
    lineHeight: 18,
  },
  or: {
    ...l.my20,
    textAlign: 'center',
  },
});

export default ChangePasswordForm;
