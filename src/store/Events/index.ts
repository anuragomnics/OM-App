import {createSlice, PayloadAction, createAction} from '@reduxjs/toolkit';

// custom
import {fetchEvents} from './ThunkActions';
import {
  EventType,
  EventsResponseType,
} from '../../types/responses/EventsResponseType';

export interface EventsList {
  data: EventType[];
  has_more: boolean;
  total: number;
  id?: number;
}

interface EventsListObj {
  [key: string]: EventsList;
}

interface Store {
  eventsList: EventsListObj;
}

const initialState: Store = {
  eventsList: {},
};

export const resetEventsList = createAction('reset-news-list');

const EventsSlice = createSlice({
  name: 'EVENTS_SLICE',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(resetEventsList, () => initialState);
    builder.addCase(
      fetchEvents.fulfilled,
      (state, action: PayloadAction<EventsResponseType>) => {
        //@ts-ignore
        const ID = action?.meta?.arg?.id;
        state.eventsList[ID] = {
          data: action.payload.data,
          has_more: action.payload.has_more,
          total: action.payload.total,
          id: ID,
        };
      },
    );
  },
});

export default EventsSlice.reducer;

export * from './ThunkActions';
export * from './Selectors';
