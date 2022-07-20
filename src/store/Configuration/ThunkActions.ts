import {createAsyncThunk} from '@reduxjs/toolkit';
import AuthService from '../../services/AuthService';
import ConfigurationService from '../../services/ConfigurationService';
import {PaymentService} from '../../services/PaymentService';
import {LoadAppFontsParams} from '../../types/request';

export const FetchAppSettingsPrefix = '@Configuration/fetchAppSettings';
export const FetchAppNavigationsPrefix = '@Configuration/fetchAppNavigations';
export const LoadAppFontsPrefix = '@Configuration/LoadAppFonts';
export const FetchDashboardSettingsPrefix =
  '@Configuration/fetchDashboardSettings';
export const FetchCheckoutSettingsPrefix =
  '@Configuration/fetchCheckoutSettings';

export const fetchAppSettings = createAsyncThunk(
  FetchAppSettingsPrefix,
  async (_, {rejectWithValue}) => {
    try {
      return await ConfigurationService.fetchAppSettings();
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  },
);

export const fetchAppSettingsNew = createAsyncThunk(
  FetchAppSettingsPrefix,
  async (_, {rejectWithValue}) => {
    try {
      return await ConfigurationService.fetchAppSettingsNew();
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  },
);

export const fetchAppNavigations = createAsyncThunk(
  FetchAppNavigationsPrefix,
  async (_, {rejectWithValue}) => {
    try {
      return await ConfigurationService.fetchAppNavigations();
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  },
);

export const fetchLoadAppFonts = createAsyncThunk(
  LoadAppFontsPrefix,
  // if you type your function argument here
  async (params: LoadAppFontsParams, {rejectWithValue}) => {
    try {
      return await ConfigurationService.fetchLoadAppFonts(params);
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  },
);

export const fetchDashboardSettings = createAsyncThunk(
  FetchDashboardSettingsPrefix,
  async (id: number, {rejectWithValue}) => {
    try {
      return await ConfigurationService.fetchDashboardSettings(id);
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  },
);

export const fetchCheckoutSettings = createAsyncThunk(
  FetchCheckoutSettingsPrefix,
  async (_, {rejectWithValue}) => {
    try {
      return await PaymentService.fetchGetCheckoutSettings();
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  },
);
