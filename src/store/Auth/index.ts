import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  fetchRegisterNewDevice,
  fetchLogin,
  fetchLogout,
  fetchProfile,
} from './ThunkActions';
import {RegisterNewDeviceResponseType} from '../../types/responses/RegisterNewDeviceResponseType';
import {SignInResponseType} from '../../types/responses/SignInResponseType';
import {
  UserProfileType,
  ProfileResponseType,
} from '../../types/responses/ProfileResponseType';

interface AuthenticationStore extends SignInResponseType {
  user: UserProfileType | undefined;
  isLoggedIn: boolean;
}

const initialState: AuthenticationStore = {
  token_type: undefined,
  expires_in: undefined,
  access_token: undefined,
  refresh_token: undefined,
  sub_plans: [],
  is_legally_register: 0,
  user: undefined,
  isLoggedIn: false,
};

const AuthenticationSlice = createSlice({
  name: 'AUTHENTICATION_SLICE',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(
      fetchRegisterNewDevice.fulfilled,
      (state, action: PayloadAction<RegisterNewDeviceResponseType>) => {
        state.token_type = action.payload.token_type;
        state.expires_in = action.payload.expires_in;
        state.access_token = action.payload.access_token;
        state.refresh_token = action.payload.refresh_token;
      },
    );
    builder.addCase(
      fetchLogin.fulfilled,
      (state, action: PayloadAction<SignInResponseType>) => {
        state.token_type = action.payload.token_type;
        state.expires_in = action.payload.expires_in;
        state.access_token = action.payload.access_token;
        state.refresh_token = action.payload.refresh_token;
        state.is_legally_register = action.payload.is_legally_register;
        state.sub_plans = action.payload.sub_plans;
        state.isLoggedIn = true;
      },
    );
    builder.addCase(fetchLogout.fulfilled, state => {
      state.token_type = initialState.token_type;
      state.expires_in = initialState.expires_in;
      state.access_token = initialState.access_token;
      state.refresh_token = initialState.refresh_token;
      state.is_legally_register = initialState.is_legally_register;
      state.sub_plans = initialState.sub_plans;
      state.isLoggedIn = false;
    });
    builder.addCase(
      fetchProfile.fulfilled,
      (state, action: PayloadAction<ProfileResponseType>) => {
        state.user = action.payload.data;
      },
    );
  },
});

export default AuthenticationSlice.reducer;

export * from './Selectors';

export * from './ThunkActions';
