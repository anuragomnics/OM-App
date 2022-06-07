import {useEffect, useState} from 'react';
import NewsService from '../../../services/NewsService';
import {SingleNewsType} from '../../../types/responses/SingleNewsResposeType';

export const useSingleNews = (id: number) => {
  const [news, setNews] = useState<SingleNewsType | undefined>(undefined);
  let isLoading: boolean = false;

  useEffect(() => {
    isLoading = true;
    async function fetchData() {
      try {
        const {data} = await NewsService.fetchSingleNews(id);
        setNews(data);
        isLoading = false;
      } catch (error) {
        isLoading = false;
        // eslint-disable-next-line no-console
        console.log('[ERROR] fetchData', error);
      }
    }

    fetchData();
  }, [id]);

  return {
    isLoading,
    newsDetails: news,
  };
};
