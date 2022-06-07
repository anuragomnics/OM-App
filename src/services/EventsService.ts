// custom
import HttpService from './HttpService';
import {FetchEventsRequestParams} from '../types/request';
import {generateParams} from '../utils/UrlParams';
import {EventsResponseType} from '../types/responses/EventsResponseType';
import {SingleEventResponseType} from '../types/responses/SingleEventResponseType';

const fetchEvents = async (params?: FetchEventsRequestParams) => {
  const requestParams = generateParams(params, [
    'limit',
    'page',
    'organizer_id',
    'top',
    'keyword',
    'pagination',
  ]);
  return await HttpService.Get<EventsResponseType>('/events', {
    params: requestParams,
  });
};

const fetchSingleEvent = async (id: number) => {
  return await HttpService.Get<SingleEventResponseType>(`/events/${id}`, {});
};

const EventsService = {
  fetchEvents,
  fetchSingleEvent,
};

export default EventsService;
