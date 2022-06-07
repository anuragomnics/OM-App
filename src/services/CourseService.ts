// custom
import HttpService from './HttpService';
import {CoursesResponseType} from '../types/responses/CourseResponseType';
import {RequestParams} from '../types/request';
import {SingleCourseResponseType} from '../types/responses/SingleCourseResponseType';

const fetchCourses = async (params?: RequestParams) => {
  return await HttpService.Get<CoursesResponseType>('/courses', {
    params: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 1000,
      // lang: params?.lang ?? 'en',
      // sort: params?.sort ?? 'id',
      keyword: params?.keyword ?? '',
      top: params?.top ?? 0,
      display_price: params?.display_price ?? 0,
      display_duration: params?.display_duration ?? 0,
      display_number_of_chapter: params?.display_number_of_chapter ?? 0,
    },
  });
};

const fetchSingleCourse = async (id: number) => {
  return await HttpService.Get<SingleCourseResponseType>(`/courses/${id}`, {
    params: {
      lang: 'en',
    },
  });
};

const CourseService = {
  fetchCourses,
  fetchSingleCourse,
};

export default CourseService;
