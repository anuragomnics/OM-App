import {createDraftSafeSelector} from '@reduxjs/toolkit';
import {RootState} from '../../store';

const selectSelf = (state: RootState) => state;

export const SalutationsSelector = () =>
  createDraftSafeSelector(selectSelf, state => {
    return state.masterData.salutations ?? [];
  });

export const TitlesSelector = () =>
  createDraftSafeSelector(selectSelf, state => {
    return state.masterData.titles ?? [];
  });
