import {useEffect, useState} from 'react';
import CourseService from '../../../services/CourseService';
import {SingleCourseType} from '../../../types/responses/SingleCourseResponseType';

export const useSingleCourse = (id: number) => {
  const [course, setCourse] = useState<SingleCourseType | undefined>(undefined);

  useEffect(() => {
    async function fetchData() {
      try {
        const {data} = await CourseService.fetchSingleCourse(id);
        setCourse(data);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('[ERROR] fetchData', error);
      }
    }

    fetchData();
  }, [id]);

  return {
    isLoading: !course,
    data: course,
  };
};
