import {createSlice, PayloadAction, createAction} from '@reduxjs/toolkit';

// custom
import {fetchCourses} from './ThunkActions';
import {
  CourseType,
  CoursesResponseType,
} from '../../types/responses/CourseResponseType';

export interface courseList {
  data: Array<CourseType>;
  has_more: boolean;
  total: number;
  id?: number;
}

interface courseListObj {
  [key: string]: courseList;
}

interface Store {
  coursesList: courseListObj;
}

const initialState: Store = {
  coursesList: {},
};

export const resetCoursesList = createAction('reset-courses-list');

const CourseSlice = createSlice({
  name: 'COURSE_SLICE',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(resetCoursesList, () => initialState);
    builder.addCase(
      fetchCourses.fulfilled,
      (state, action: PayloadAction<CoursesResponseType>) => {
        //@ts-ignore
        const ID = action?.meta?.arg?.id;
        state.coursesList[ID] = {
          data: action.payload.data,
          has_more: action.payload.has_more,
          total: action.payload.total,
          id: ID,
        };
      },
    );
  },
});

export default CourseSlice.reducer;

export * from './ThunkActions';
export * from './Selectors';
