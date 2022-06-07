import React, {FC} from 'react';
import {View, StyleSheet} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
// styles
import {t, f, l, c} from '../../../styles/shared';
// custom
import Input from '../../../components/FormControls/Input';
import Button from '../../../components/Button';
import {SharedValidationSchema} from '../../../utils/ValidationSchemaUtil';
import Text from '../../../components/Text';

const validationSchema = yup.object().shape({
  code: SharedValidationSchema.phoneNumber,
});

const ForgotPasswordCodeForm: FC<any> = () => {
  return (
    <View>
      <Text style={[styles.header]}>
        {
          'We will send a mail to the email address you registered to regain your password'
        }
      </Text>
      <Formik
        initialValues={{
          code: '',
        }}
        validationSchema={validationSchema}
        onSubmit={values => console.log(values)}>
        {({
          errors,
          values,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <>
            <Input
              touched={touched.code}
              error={errors.code}
              onChangeText={handleChange('code')}
              value={values.code}
              onBlur={handleBlur('code')}
              placeholder={'Enter 6-digit code'}
            />
            <View style={styles.resendCodeContainer}>
              <Text>{'Not yet received? '}</Text>
              <Button
                theme={'simplePrimary'}
                title={'Resend Now!'}
                onPress={handleSubmit}
              />
            </View>
            <Button theme={'primary'} title={'Send'} onPress={handleSubmit} />
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
  resendCodeContainer: {
    ...l.mb20,
    ...l.flexRow,
    ...l.flexCenter,
  },
});

export default ForgotPasswordCodeForm;
