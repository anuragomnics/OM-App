import {createAsyncThunk} from '@reduxjs/toolkit';
import {RequestParams} from '../../types/request';
import CourseService from '../../services/CourseService';

export const FetchCoursesPrefix = '@Course/fetchCourses';

export const fetchCourses = createAsyncThunk(
  FetchCoursesPrefix,
  async (params: RequestParams | undefined, {rejectWithValue}) => {
    try {
      return await CourseService.fetchCourses(params);
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  },
);
