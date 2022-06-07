import {createAsyncThunk} from '@reduxjs/toolkit';
import AuthService from '../../services/AuthService';
import {
  sendResetPasswordParams,
  SetNewPasswordParams,
  SignInParams,
  updatePasswordParams,
} from '../../types/request';

export const RegisterNewDevicePrefix = '@Auth/RegisterNewDevice';
export const FetchLoginPrefix = '@Auth/LoginUser';
export const FetchLogoutPrefix = '@Auth/LogoutUser';
export const FetchResetPasswordCodePrefix = '@Auth/ResetPasswordCode';
export const UpdatePasswordPrefix = '@Auth/UpdatePassword';
export const SetNewPasswordPrefix = '@Auth/SetNewPasswordPrefix';
export const FetchprofilePrefix = '@Auth/Fetchprofile';

export const fetchRegisterNewDevice = createAsyncThunk(
  RegisterNewDevicePrefix,
  async () => {
    return await AuthService.registerNewDevice();
  },
);

export const fetchLogin = createAsyncThunk(
  FetchLoginPrefix,
  async (values: SignInParams) => {
    return await AuthService.loginUser(values);
  },
);

export const fetchLogout = createAsyncThunk(FetchLogoutPrefix, async () => {
  return await AuthService.logoutUser();
});

export const fetchResetPasswordCode = createAsyncThunk(
  FetchResetPasswordCodePrefix,
  async (values: sendResetPasswordParams) => {
    return await AuthService.sendResetPasswordCode(values);
  },
);

export const updatePassword = createAsyncThunk(
  UpdatePasswordPrefix,
  async (values: updatePasswordParams) => {
    return await AuthService.updatePassword(values);
  },
);

export const setNewPassword = createAsyncThunk(
  SetNewPasswordPrefix,
  async (values: SetNewPasswordParams) => {
    return await AuthService.setNewPassword(values);
  },
);

export const fetchProfile = createAsyncThunk(FetchprofilePrefix, async () => {
  return await AuthService.fetchProfile();
});
