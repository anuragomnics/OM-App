import * as yup from 'yup';

const phoneRegExp =
  /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;

export const SharedValidationSchema = {
  firstName: yup.string().required('Bitte geben Sie Ihren Vornamen ein'),
  lastName: yup.string().required('Bitte geben Sie Ihren Nachnamen ein'),
  userName: yup.string().required('Bitte geben Sie Ihren Benutzernamen ein'),
  email: yup
    .string()
    .email('Ihre E-Mail-Adresse ist ungültig')
    .required('Bitte geben Sie Ihre E-Mail-Adresse ein'),
  title: yup.string().required('Please enter title'),
  salutation: yup.string().required('Bitte wählen Sie eine Anrede aus'),
  password: yup
    .string()
    .min(6, 'Das Passwort muss mindestens 6 Zeichen enthalten')
    .required('Bitte geben Sie eine Passwort ein'),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Die Passwörter stimmen nicht überein')
    .required('Bitte wiederholen Sie das Passwort'),
  phoneNumber: yup
    .string()
    .matches(phoneRegExp, 'Ihre Telefonnummer ist ungültig')
    .required('Bitte geben Sie Ihre Telefonnummer ein'),
  termsAndPolicyChecked: yup.bool().equals([true]),
  resetPasswordCode:
    yup.string().required('Bitte geben Sie den Code ein') || undefined,
};
