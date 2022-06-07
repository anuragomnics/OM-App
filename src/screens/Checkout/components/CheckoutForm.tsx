import React, {FC, useState} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {Formik} from 'formik';

// custom
import Input from '../../../components/FormControls/Input';
import Button from '../../../components/Button';
import {c, t, f, l} from '../../../styles/shared';
import NavigationService from '../../../services/NavigationService';
import TermsAndPolicy from '../../../components/FormControls/TermsAndPolicy';
import TitleSelector from '../../Register/components/TitleSelector';
import Radiogroup from '../../../components/RadioGroup';
import Text from '../../../components/Text';
import {ExtraControlFields} from './ExtraFormFields';
import {useAppSelector} from '../../../hooks/useRedux';
import {CheckoutSettingsSelector} from '../../../store/Configuration';
import Constants from '../../../config/Constants';
import {useCheckoutMetaDataForm, useLawTextValue} from '../hooks';
import {SalutationsSelector, TitlesSelector} from '../../../store/MasterData';

const CommonValues = {
  salutation: undefined,
  title: undefined,
  firstName: '',
  lastName: '',
  email: '',
  address: '',
  city: '',
  zip: '',
  company: '',
  orderAs: Constants.OrderAs.PrivateCitizen,
};

export interface FormValues {
  [key: string]: string | undefined;
}

interface Props {
  onFormSubmit?: (values: FormValues) => void;
  formLoading?: boolean;
}

const CheckoutForm: FC<Props> = ({onFormSubmit, formLoading}) => {
  const salutations = useAppSelector(SalutationsSelector());
  const titles = useAppSelector(TitlesSelector());
  const checkoutSettings = useAppSelector(CheckoutSettingsSelector());
  const lawTexts = useLawTextValue(checkoutSettings);

  // state
  const [orderAs, setOrderAs] = useState<string>(
    Constants.OrderAs.PrivateCitizen,
  );
  const {validationSchema, extraValues, fields} = useCheckoutMetaDataForm(
    checkoutSettings,
    orderAs,
    lawTexts,
  );

  const gotoSignUp = () => {
    NavigationService.pushToScreen('Register');
  };

  const onSubmit = (values: FormValues) => {
    values['setting_id'] = checkoutSettings?.setting_id.toString();
    // @ts-ignore
    values['orderAs'] = orderAs;
    onFormSubmit?.(values);
  };

  const initialValues = {
    ...CommonValues,
    ...extraValues,
  };

  const orderAsOptions = [
    {
      value: Constants.OrderAs.PrivateCitizen,
      title: 'Privatperson',
    },
    {
      value: Constants.OrderAs.Company,
      title: 'Unternehmen',
    },
  ];

  return (
    <Formik
      enableReinitialize={true}
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
          <View style={[l.mb30]}>
            <Text style={styles.orderAs}>{'Ich bestelle als'}</Text>
            <Radiogroup
              options={orderAsOptions}
              onSelect={value => {
                setOrderAs(value.value);
                setFieldValue('orderAs', value.value, true);
              }}
            />
          </View>

          <Text style={styles.personalData}>{'Persönliche Daten'}</Text>
          <Text style={styles.emailDescription}>
            {
              '(Nach der erfolgreichen Bestellung, senden wir Ihnen an die E-Mail-Adresse die Benutzerkonto Informationen zu.)'
            }
          </Text>
          {orderAs === Constants.OrderAs.Company && (
            <Input
              touched={touched.company}
              error={errors.company}
              onChangeText={handleChange('company')}
              value={values.company}
              onBlur={handleBlur('company')}
              placeholder={'Unternehmen'}
            />
          )}

          {/* salutations */}
          <TitleSelector
            options={salutations}
            error={errors.salutation}
            value={values.salutation}
            onSelect={value => setFieldValue('salutation', value, true)}
            placeholder={'Anrede'}
            touched={touched.salutation}
          />

          {/* titles */}
          <TitleSelector
            options={titles}
            error={errors.title}
            value={values.title}
            onSelect={value => setFieldValue('title', value, true)}
            placeholder={'Titel'}
            touched={touched.title}
          />
          <Input
            touched={touched.firstName}
            error={errors.firstName}
            onChangeText={handleChange('firstName')}
            value={values.firstName}
            onBlur={handleBlur('firstName')}
            placeholder={'Vorname'}
          />
          <Input
            touched={touched.lastName}
            error={errors.lastName}
            onChangeText={handleChange('lastName')}
            value={values.lastName}
            onBlur={handleBlur('lastName')}
            placeholder={'Nachname'}
          />
          <Input
            touched={touched.email}
            error={errors.email}
            onChangeText={handleChange('email')}
            value={values.email}
            onBlur={handleBlur('email')}
            placeholder={'E-Mail-Adresse'}
          />
          <Input
            touched={touched.address}
            error={errors.address}
            onChangeText={handleChange('address')}
            value={values.address}
            onBlur={handleBlur('address')}
            placeholder={'Straße'}
          />
          <Input
            touched={touched.city}
            error={errors.city}
            onChangeText={handleChange('city')}
            value={values.city}
            onBlur={handleBlur('city')}
            placeholder={'Ort'}
          />
          <Input
            touched={touched.zip}
            error={errors.zip}
            onChangeText={handleChange('zip')}
            value={values.zip}
            onBlur={handleBlur('zip')}
            placeholder={'Zip'}
            widgetStyles={{
              container: {marginBottom: 0},
            }}
          />

          <ExtraControlFields data={fields} />

          {/* terms and conditions */}
          {lawTexts.map((law_text, i) => {
            return (
              <View key={i}>
                {law_text.legal_text_element && (
                  <TermsAndPolicy
                    title={law_text?.legal_text_element}
                    content={law_text?.content}
                    onValueChange={bool => {
                      setFieldValue(
                        `lawText_${law_text.type}_${law_text.id}`,
                        bool
                          ? JSON.stringify({
                              id: law_text.id,
                              identifier: law_text.identifier,
                            })
                          : '',
                        true,
                      );
                    }}
                    // @ts-ignore
                    error={errors[`lawText_${law_text.type}_${law_text.id}`]}
                    // @ts-ignore
                    touched={touched[`lawText_${law_text.type}_${law_text.id}`]}
                  />
                )}
              </View>
            );
          })}

          <View style={[l.mt20]}>
            <Button
              theme={'primary'}
              title={'Bestellen'}
              onPress={handleSubmit}
              loading={formLoading}
              loadingTitle={'Bestellung'}
            />
          </View>
        </>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  orderAs: {
    ...f.fontWeightMedium,
    // ...l.mt30,
  },
  personalData: {
    ...f.fontWeightMedium,
  },
  emailDescription: {
    ...t.pSM,
    color: c.black200,
    ...l.mt5,
    ...l.mb10,
  },
});

export default CheckoutForm;
