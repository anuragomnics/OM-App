import {createAsyncThunk} from '@reduxjs/toolkit';
// custom
import {FetchNewsRequestParams} from '../../types/request';
import NewsService from '../../services/PostsService';

export const fetchNewsPrefix = '@News/fetchNews';
export const fetchPostsPrefix = '@News/fetchPosts';
export const fetchAllPostsPrefix = '@News/fetchAllPosts';

export const fetchPosts = createAsyncThunk(
  fetchPostsPrefix,
  async (params: FetchNewsRequestParams | undefined, {rejectWithValue}) => {
    try {
      return await NewsService.fetchPosts(params);
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  },
);

export const fetchAllPosts = createAsyncThunk(
  fetchAllPostsPrefix,
  async (params: FetchNewsRequestParams | undefined, {rejectWithValue}) => {
    try {
      return await NewsService.fetchPosts(params);
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  },
);
