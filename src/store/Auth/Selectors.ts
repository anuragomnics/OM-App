import {createDraftSafeSelector} from '@reduxjs/toolkit';
import {RootState} from '../index';

const selectSelf = (state: RootState) => state;

export const UserSelector = () =>
  createDraftSafeSelector(selectSelf, state => {
    return state.auth.user;
  });

export const IsAuthSelector = () =>
  createDraftSafeSelector(selectSelf, state => {
    return !!state.auth.isLoggedIn;
  });
