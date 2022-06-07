import {useEffect, useState} from 'react';
import EventsService from '../../../services/EventsService';
import {
  SingleEventResponseType,
  SingleEventType,
} from '../../../types/responses/SingleEventResponseType';

export const useSingleEvent = (id: number, initialLoading: boolean) => {
  const [event, setEvent] = useState<SingleEventType | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(initialLoading);
  // let isLoading: boolean = false;

  useEffect(() => {
    // isLoading = true;
    setIsLoading(true);
    async function fetchData() {
      try {
        const {data} = await EventsService.fetchSingleEvent(id);
        // isLoading = false;
        setIsLoading(false);
        setEvent(data);
      } catch (error) {
        // isLoading = false;
        setIsLoading(false);
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
