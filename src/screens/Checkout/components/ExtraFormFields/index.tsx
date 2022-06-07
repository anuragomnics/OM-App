import {useFormikContext} from 'formik';

import React, {FC} from 'react';
import {View} from 'react-native';
import Input from '../../../../components/FormControls/Input';
import {l} from '../../../../styles/shared';
import {CheckoutSettingField} from '../../../../types/responses/CheckoutSettingResponseType';
import {FormValues} from '../CheckoutForm';

interface ExtraFiled extends CheckoutSettingField {
  fieldName: string;
  placeholder: string;
}

interface Props {
  data: Array<ExtraFiled> | undefined;
}

export const ExtraControlFields: FC<Props> = ({data}) => {
  const {errors, values, touched, handleChange, handleBlur} =
    useFormikContext<FormValues>();

  const renderField = ({fieldName, placeholder, type}: ExtraFiled) => {
    let keyboardType = 'default';
    let multiline = false;
    let height = 50;
    switch (type) {
      case 'phone':
        keyboardType = 'number-pad';
        break;
      case 'textarea':
        multiline = true;
        height = 100;
        break;
      default:
        break;
    }

    return (
      <Input
        key={fieldName}
        touched={touched[fieldName]}
        error={errors[fieldName]}
        onChangeText={handleChange(fieldName)}
        onBlur={handleBlur('vat_id')}
        value={values[fieldName]}
        placeholder={placeholder}
        // @ts-ignore
        keyboardType={keyboardType}
        multiline={multiline}
        widgetStyles={{wrapper: {height: height}}}
      />
    );
  };

  if (!data || (data && data.length === 0)) {
    return null;
  }

  return (
    <View style={[l.mt15]}>{data.map((v: ExtraFiled) => renderField(v))}</View>
  );
};
