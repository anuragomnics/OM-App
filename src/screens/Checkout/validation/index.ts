import * as Yup from 'yup';
import {SharedValidationSchema} from '../../../utils/ValidationSchemaUtil';

const CommonValidationSchema = {
  address: Yup.string().required('Bitte geben Sie eine Adresse ein'),
  city: Yup.string().required('Bitte geben Sie einen Ort ein'),
  zip: Yup.string().required('Bitte Geben Sie einen Postleitzahl ein'),
  email: SharedValidationSchema.email,
  salutation: SharedValidationSchema.salutation,
  // title: SharedValidationSchema.title,
  firstName: SharedValidationSchema.firstName,
  lastName: SharedValidationSchema.lastName,
};

export const PrivateCitizenValidationSchema = Yup.object().shape({
  ...CommonValidationSchema,
});
export const CompanyValidationSchema = Yup.object().shape({
  ...CommonValidationSchema,
  company: Yup.string().required(
    'Bitte geben Sie den Namen Ihres Unternehmens an',
  ),
});
