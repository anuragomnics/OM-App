import React from 'react';
import {View, TextInput, Image, ScrollView, StyleSheet} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
// styles
import {t, f, l, c} from '../../../styles/shared';
// custom
import Input from '../../../components/FormControls/Input';
import Button from '../../../components/Button';
import TermsAndPolicy from '../../../components/FormControls/TermsAndPolicy';
import AvatarSelector from './AvatarSelector';
import {SharedValidationSchema} from '../../../utils/ValidationSchemaUtil';
import TitleSelector from './TitleSelector';
import Text from '../../../components/Text';

interface FormValues {
  title: string | undefined;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAndPolicyChecked: boolean;
}

const initialValues: FormValues = {
  title: undefined,
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  termsAndPolicyChecked: false,
};

const validationSchema = yup.object().shape({
  title: SharedValidationSchema.title,
  firstName: SharedValidationSchema.firstName,
  lastName: SharedValidationSchema.lastName,
  email: SharedValidationSchema.email,
  password: SharedValidationSchema.password,
  confirmPassword: SharedValidationSchema.confirmPassword,
  termsAndPolicyChecked: SharedValidationSchema.termsAndPolicyChecked,
});

interface FormControlsProps {
  onSignIn?: () => void;
  onFormSubmit?: () => void;
}

const RegisterForm: React.FC<FormControlsProps> = ({
  onSignIn,
  onFormSubmit,
}) => {
  const goToSignIn = () => {
    onSignIn?.();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={values => console.log(values)}>
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
          <AvatarSelector />
          <TitleSelector
            value={values.title}
            placeholder={'Title'}
            onSelect={value => setFieldValue('title', value, true)}
            error={errors.title}
          />
          <Input
            touched={touched.firstName}
            value={values.firstName}
            placeholder={'First Name'}
            onChangeText={handleChange('firstName')}
            onBlur={handleBlur('firstName')}
            error={errors.firstName}
          />
          <Input
            touched={touched.lastName}
            error={errors.lastName}
            onChangeText={handleChange('lastName')}
            value={values.lastName}
            onBlur={handleBlur('lastName')}
            placeholder={'Last Name'}
          />
          <Input
            touched={touched.email}
            error={errors.email}
            onChangeText={handleChange('email')}
            value={values.email}
            onBlur={handleBlur('email')}
            placeholder={'Email'}
          />
          <Input
            touched={touched.password}
            error={errors.password}
            onChangeText={handleChange('password')}
            value={values.password}
            onBlur={handleBlur('password')}
            placeholder={'Password'}
          />
          <Input
            touched={touched.confirmPassword}
            error={errors.confirmPassword}
            onChangeText={handleChange('confirmPassword')}
            value={values.confirmPassword}
            onBlur={handleBlur('confirmPassword')}
            placeholder={'Confirm password'}
            widgetStyles={{
              container: {marginBottom: 0},
            }}
          />

          <TermsAndPolicy
            title={
              'By creating an account you agree to our Terms of service and Privacy Policy'
            }
            // onCheck={values.termsAndPolicyChecked}
          />
          <Button theme={'primary'} title={'Sign up'} />
          <View style={styles.signInContainer}>
            <Text>{'Already have an account? '}</Text>
            <Button
              theme={'simplePrimary'}
              title={'Sign in!'}
              onPress={goToSignIn}
            />
          </View>
        </>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  signInContainer: {
    ...l.flexRow,
    ...l.flexCenter,
    ...l.mt20,
  },
});

export default React.memo(RegisterForm);
