// custom
import HttpService from './HttpService';
import {FetchNewsRequestParams} from '../types/request';
import {generateParams} from '../utils/UrlParams';
import {NewsResponseType} from '../types/responses/NewsResponsetype';
import {SingleNewsResponseType} from '../types/responses/SingleNewsResposeType';
import DeviceHelper from '../config/DeviceHelper';

const fetchPosts = async (params?: any) => {
  return await HttpService.Post<any>('/websiteApp/posts', {
    ...params,
  });
};

const fetchSinglePost = async (id: number) => {
  return await HttpService.Get<any>(`/posts/${id}?channel=${DeviceHelper.OS}`);
};

const NewsService = {
  fetchPosts,
  fetchSinglePost,
};

export default NewsService;
