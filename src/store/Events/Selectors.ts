import {createDraftSafeSelector} from '@reduxjs/toolkit';
import {RootState} from '../../store';

const selectSelf = (state: RootState) => state;

export const EventsListSelector = () =>
  createDraftSafeSelector(selectSelf, state => {
    return state.events.eventsList;
  });

export const EventsPaginationDetailsSelector = () =>
  createDraftSafeSelector(selectSelf, state => {
    return state.events.eventsPaginationDetails;
  });
