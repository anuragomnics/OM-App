import {createAsyncThunk} from '@reduxjs/toolkit';
// custom
import {FetchEventsRequestParams} from '../../types/request';
import EventsService from '../../services/EventsService';

export const fetchEventsPrefix = '@Events/fetchEvents';

export const fetchEvents = createAsyncThunk(
  fetchEventsPrefix,
  async (params: FetchEventsRequestParams | undefined, {rejectWithValue}) => {
    try {
      return await EventsService.fetchEvents(params);
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  },
);
