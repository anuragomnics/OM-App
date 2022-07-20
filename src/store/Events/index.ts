import {createSlice, PayloadAction, createAction} from '@reduxjs/toolkit';

// custom
import {fetchAllEvents, fetchEvents} from './ThunkActions';
import {
  NewsType,
  NewsResponseType,
} from '../../types/responses/NewsResponsetype';
import {PostsListSectionType} from '../../types/responses/SettingResponseType';
import {
  PaginationDetailsType,
  PostsListResponseType,
  PostType,
} from '../../types/responses/PostsListResponseType';
import {
  EventsListResponseType,
  EventType,
} from '../../types/responses/EventsListResponseType';

interface EventsListObj {
  [key: string]: EventType[];
}
interface EventsListPaginationObj {
  [key: string]: PaginationDetailsType;
}

interface Store {
  eventsList: EventsListObj;
  eventsPaginationDetails: EventsListPaginationObj;
  allEvents: EventType[];
}

const initialState: Store = {
  eventsList: {},
  eventsPaginationDetails: {},
  allEvents: [],
};

export const resetEventsList = createAction('reset-events-list');

const EventsSlice = createSlice({
  name: 'EVENTS_SLICE',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(resetEventsList, () => initialState);
    builder.addCase(
      fetchEvents.fulfilled,
      (state, action: PayloadAction<EventsListResponseType>) => {
        //@ts-ignore
        const ID = action?.meta?.arg?.id;
        state.eventsList[ID] = action.payload.eventDetails;
        state.eventsPaginationDetails[ID] = action.payload.paginationDetails;
      },
    );
  },
});

export default EventsSlice.reducer;

export * from './ThunkActions';
export * from './Selectors';
