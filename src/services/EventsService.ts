// custom
import HttpService from './HttpService';
import {FetchNewsRequestParams} from '../types/request';
import {generateParams} from '../utils/UrlParams';
import {NewsResponseType} from '../types/responses/NewsResponsetype';
import {SingleNewsResponseType} from '../types/responses/SingleNewsResposeType';
import DeviceHelper from '../config/DeviceHelper';

const fetchEvents = async (params?: any) => {
  return await HttpService.Post<any>('/websiteApp/events', {
    ...params,
  });
};

const fetchSingleEvent = async (id: number) => {
  return await HttpService.Get<any>(`/events/${id}?channel=${DeviceHelper.OS}`);
};

const fetchCoordsFromAddress = async () => {
  await HttpService.Get<any>(
    'https://nominatim.openstreetmap.org/search?q=135+pilkington+avenue,+birmingham&format=json',
  );
};

const EventsService = {
  fetchEvents,
  fetchSingleEvent,
  fetchCoordsFromAddress,
};

export default EventsService;
