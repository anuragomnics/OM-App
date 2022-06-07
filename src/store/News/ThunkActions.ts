import {createAsyncThunk} from '@reduxjs/toolkit';
// custom
import {FetchNewsRequestParams} from '../../types/request';
import NewsService from '../../services/NewsService';

export const fetchNewsPrefix = '@News/fetchNews';
export const fetchAllNewsPrefix = '@News/fetchAllNews';

export const fetchNews = createAsyncThunk(
  fetchNewsPrefix,
  async (params: FetchNewsRequestParams | undefined, {rejectWithValue}) => {
    try {
      return await NewsService.fetchNews(params);
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  },
);

export const fetchAllNews = createAsyncThunk(
  fetchAllNewsPrefix,
  async (params: FetchNewsRequestParams | undefined, {rejectWithValue}) => {
    try {
      return await NewsService.fetchNews(params);
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  },
);
