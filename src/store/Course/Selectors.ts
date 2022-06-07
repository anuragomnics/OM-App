import {createDraftSafeSelector} from '@reduxjs/toolkit';
import {RootState} from '../../store';

const selectSelf = (state: RootState) => state;

export const CourseListSelector = () =>
  createDraftSafeSelector(selectSelf, state => {
    return state.course.coursesList;
  });
