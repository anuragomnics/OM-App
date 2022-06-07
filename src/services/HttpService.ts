import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
import {Alert} from 'react-native';
import {flatten} from 'lodash';

import Settings from '../config/Settings';
import {Store} from '../store';
import NavigationService from './NavigationService';
import {ScreenID} from '../navigation/types';

interface CustomRequestConfig extends AxiosRequestConfig {
  dialogType?: 'Alert' | 'Dialog' | 'None';
}

interface CustomAxiosError extends AxiosError {
  config: CustomRequestConfig;
}

const getErrorMessage = (error: CustomAxiosError) => {
  let msg = 'Something were wrong. Please try again';
  if (error.response && typeof error.response.data === 'string') {
    msg = error.response.data;
  }
  if (error.response && error.response.data) {
    if (
      error.response.data.error &&
      typeof error.response.data.error === 'string'
    ) {
      msg = error.response.data.error;
    }
    if (error.response.data.message) {
      msg = error.response.data.message;
    }
    if (typeof error.response.data.errors === 'object') {
      msg = flatten(Object.values(error.response.data.errors)).join('\r\n');
    }
  }
  return msg;
};

axios.defaults.baseURL = Settings.API_URL;

axios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: CustomAxiosError) => {
    const errorMessage = getErrorMessage(error);
    if (error.config.dialogType === 'Alert') {
      Alert.alert('Error', errorMessage);
    } else if (error.config.dialogType === 'Dialog') {
    }

    if (error.response?.status == 401) {
      NavigationService.resetToScreen(ScreenID.Login);
    }

    return Promise.reject(error);
  },
);

const createAxiosConfig = (config: CustomRequestConfig = {}) => {
  const {access_token, token_type} = Store.getState().auth;
  const AxiosConfig = {
    ...config,
    dialogType: config.dialogType || 'Dialog',
    headers: {
      ...config.headers,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  if (access_token) {
    // @ts-ignore
    AxiosConfig.headers['Authorization'] = `${token_type} ${access_token}`;
  }

  return AxiosConfig;
};

export default class HttpService {
  static async Get<T>(url: string, config: CustomRequestConfig = {}) {
    return await axios.get<T>(url, createAxiosConfig(config)).then(res => {
      return res.data;
    });
  }

  static async Post<T>(
    url: string,
    data: any,
    config: CustomRequestConfig = {},
  ) {
    return await axios
      .post<T>(url, data, createAxiosConfig(config))
      .then(res => res.data);
  }

  static async Put<T>(
    url: string,
    data: any,
    config: CustomRequestConfig = {},
  ) {
    return await axios
      .put(url, data, createAxiosConfig(config))
      .then(res => res.data);
  }

  static async Patch<T>(
    url: string,
    data: any,
    config: CustomRequestConfig = {},
  ) {
    return await axios
      .patch<T>(url, data, createAxiosConfig(config))
      .then(res => res.data);
  }

  static async Delete<T>(url: string, config: CustomRequestConfig = {}) {
    return await axios
      .delete<T>(url, createAxiosConfig(config))
      .then(res => res.data);
  }
}
