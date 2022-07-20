import axios from 'axios';
import {useEffect, useState} from 'react';
import EventsService from '../../../services/EventsService';
import NewsService from '../../../services/PostsService';
import {
  EventDetailsType,
  EventType,
  SingleEventResponseType,
} from '../../../types/responses/EventsListResponseType';
import {PostType} from '../../../types/responses/PostsListResponseType';
import {SingleNewsType} from '../../../types/responses/SingleNewsResposeType';

export const useSingleEvent = (id: number) => {
  const [event, setEvent] = useState<EventDetailsType | undefined>(undefined);
  let isLoading: boolean = false;

  useEffect(() => {
    isLoading = true;
    async function fetchData() {
      try {
        const {eventDetails} = await EventsService.fetchSingleEvent(id);
        setEvent(eventDetails);
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
    eventDetails: event,
  };
};

export const useCoordsFromAddress = (address: string) => {
  const [latLong, setLatLong] = useState<
    {latitude: number; longitude: number} | undefined
  >(undefined);
  let isLoading: boolean = false;

  useEffect(() => {
    isLoading = true;
    async function fetchData() {
      try {
        const res: any = await axios.get(
          `https://nominatim.openstreetmap.org/search?q=${address}&format=json`,
        );
        res?.data?.[0] &&
          setLatLong({
            latitude: res?.data?.[0].lat,
            longitude: res?.data?.[0].lon,
          });
        // setEvent(eventDetails);
        isLoading = false;
      } catch (error) {
        isLoading = false;
        // eslint-disable-next-line no-console
        console.log('[ERROR] fetchData', error);
      }
    }

    fetchData();
  }, [address]);

  return {
    isLoading,
    location: latLong,
  };
};
