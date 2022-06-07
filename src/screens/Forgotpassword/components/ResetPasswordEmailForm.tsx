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
import {sendResetPasswordParams} from '../../../types/request';
import {useAppSelector} from '../../../hooks/useRedux';
import {StatusSelector} from '../../../store/Status';
import {FetchResetPasswordCodePrefix} from '../../../store/Auth';
import FormError from '../../../components/FormError';

const validationSchema = yup.object().shape({
  email: SharedValidationSchema.email,
});

interface Props {
  onEnterCodePress: () => void;
  onFormSubmit?: (values: sendResetPasswordParams) => void;
}

const ResetPasswordEmailForm: FC<Props> = ({
  onEnterCodePress,
  onFormSubmit,
}) => {
  const {error, pending} = useAppSelector(
    StatusSelector(FetchResetPasswordCodePrefix),
  );

  const onSubmit = (values: sendResetPasswordParams) => {
    onFormSubmit?.(values);
  };

  return (
    <View>
      <Text style={[styles.header]}>
        {'Bitte folgen Sie den Anweisungen, um Ihr Passwort zurückzusetzen.'}
      </Text>

      <Formik
        initialValues={{
          email: '',
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
            {/* error */}
            <FormError
              error={error}
              errorMessage={
                'Wir können kein Konto mit dieser E-Mail-Adresse finden. Bitte versuchen Sie es erneut'
              }
            />

            <Input
              touched={touched.email}
              error={errors.email}
              onChangeText={handleChange('email')}
              value={values.email}
              onBlur={handleBlur('email')}
              placeholder={' E-Mail-Adresse'}
            />
            <Button
              theme={'primary'}
              title={'Rücksetz-Code zusenden'}
              onPress={handleSubmit}
              loading={pending}
              loadingTitle={'Rücksetz-Code zusenden'}
            />
          </>
        )}
      </Formik>
      <Text style={[styles.or]}>{'Or'}</Text>
      <Button
        theme={'primary'}
        title={'Rücksetz-Code eingeben'}
        onPress={onEnterCodePress}
      />
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
    ...l.my10,
    textAlign: 'center',
  },
});

export default ResetPasswordEmailForm;
