import {createDraftSafeSelector} from '@reduxjs/toolkit';
import {RootState} from '../../store';

const selectSelf = (state: RootState) => state;

export const NewsListSelector = () =>
  createDraftSafeSelector(selectSelf, state => {
    return state.news.newsList;
  });

export const AllNewsListSelector = () =>
  createDraftSafeSelector(selectSelf, state => {
    return state.news.allNewsList;
  });
