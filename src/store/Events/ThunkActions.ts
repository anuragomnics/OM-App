import {createAsyncThunk} from '@reduxjs/toolkit';
// custom
import {FetchNewsRequestParams} from '../../types/request';
import EventsService from '../../services/EventsService';

export const fetchEventsPrefix = '@News/fetchEvents';
export const fetchAllEventsPrefix = '@News/fetchAllEvents';

export const fetchEvents = createAsyncThunk(
  fetchEventsPrefix,
  async (params: FetchNewsRequestParams | undefined, {rejectWithValue}) => {
    try {
      return await EventsService.fetchEvents(params);
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  },
);

export const fetchAllEvents = createAsyncThunk(
  fetchAllEventsPrefix,
  async (params: FetchNewsRequestParams | undefined, {rejectWithValue}) => {
    try {
      return await EventsService.fetchEvents(params);
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  },
);
