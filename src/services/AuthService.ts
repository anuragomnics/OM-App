import {Platform} from 'react-native';

// custom
import Settings from '../config/Settings';
import {RegisterNewDeviceResponseType} from '../types/responses/RegisterNewDeviceResponseType';
import {SignInResponseType} from '../types/responses/SignInResponseType';
import {
  sendResetPasswordParams,
  SetNewPasswordParams,
  SignInParams,
  updatePasswordParams,
} from '../types/request';
import HttpService from './HttpService';
import DeviceHelper from '../config/DeviceHelper';
import {ProfileResponseType} from '../types/responses/ProfileResponseType';

const registerNewDevice = async () => {
  const os = Platform.OS;
  return await HttpService.Post<RegisterNewDeviceResponseType>(
    '/auth',
    {
      client_id: Settings.CLIENT_ID,
      client_secret: Settings.CLIENT_SECRET,
      fcm_token: os,
      agent: os,
      device_id: DeviceHelper.deviceId,
    },
    {
      params: {
        lang: 'en',
      },
    },
  );
};

const loginUser = async (values: SignInParams) => {
  return await HttpService.Post<SignInResponseType>('/customer/auth', {
    ...values,
    client_id: Settings.CLIENT_ID_PASSWORD,
    client_secret: Settings.CLIENT_SECRET_PASSWORD,
  });
};

const logoutUser = async () => {
  return await HttpService.Get('/customer/logout', {
    params: {
      device_id: DeviceHelper.deviceId,
    },
  });
};

const sendResetPasswordCode = async (values: sendResetPasswordParams) => {
  return await HttpService.Post('/customer/forgot-password', {
    ...values,
  });
};

const updatePassword = async (values: updatePasswordParams) => {
  return await HttpService.Post('/customer/set-new-password', {
    ...values,
  });
};

const setNewPassword = async (values: SetNewPasswordParams) => {
  return await HttpService.Post('/customer/update-password', {
    ...values,
  });
};

const fetchProfile = async () => {
  return await HttpService.Get<ProfileResponseType>('/customer/profile');
};

const AuthService = {
  registerNewDevice,
  loginUser,
  logoutUser,
  sendResetPasswordCode,
  updatePassword,
  fetchProfile,
  setNewPassword,
};

export default AuthService;
