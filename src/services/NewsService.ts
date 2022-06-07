// custom
import HttpService from './HttpService';
import {FetchNewsRequestParams} from '../types/request';
import {generateParams} from '../utils/UrlParams';
import {NewsResponseType} from '../types/responses/NewsResponsetype';
import {SingleNewsResponseType} from '../types/responses/SingleNewsResposeType';

const fetchNews = async (params?: FetchNewsRequestParams) => {
  const requestParams = generateParams(params, [
    'limit',
    'pagination',
    'channel',
    'page',
    'fields',
    'top_news',
    'tags',
    'categories',
    'keyword',
  ]);
  return await HttpService.Get<NewsResponseType>('/news', {
    params: requestParams,
  });
};

const fetchSingleNews = async (id: number) => {
  return await HttpService.Get<SingleNewsResponseType>(`/news/${id}`, {});
};

const NewsService = {
  fetchNews,
  fetchSingleNews,
};

export default NewsService;
