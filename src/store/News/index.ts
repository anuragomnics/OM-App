import {createSlice, PayloadAction, createAction} from '@reduxjs/toolkit';

// custom
import {fetchAllNews, fetchNews} from './ThunkActions';
import {
  NewsType,
  NewsResponseType,
} from '../../types/responses/NewsResponsetype';

export interface NewsList {
  data: NewsType[];
  has_more: boolean;
  total: number;
  id?: number;
}

interface NewsListObj {
  [key: string]: NewsList;
}

interface Store {
  newsList: NewsListObj;
  allNewsList: NewsList | {};
}

const initialState: Store = {
  newsList: {},
  allNewsList: {},
};

export const resetNewsList = createAction('reset-news-list');

const NewsSlice = createSlice({
  name: 'NEWS_SLICE',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(resetNewsList, () => initialState);
    builder.addCase(
      fetchAllNews.fulfilled,
      (state, action: PayloadAction<NewsResponseType>) => {
        //@ts-ignore
        state.allNewsList = {
          data: action.payload.data,
          has_more: action.payload.has_more,
          total: action.payload.total,
        };
      },
    );
    builder.addCase(
      fetchNews.fulfilled,
      (state, action: PayloadAction<NewsResponseType>) => {
        //@ts-ignore
        const ID = action?.meta?.arg?.id;
        state.newsList[ID] = {
          data: action.payload.data,
          has_more: action.payload.has_more,
          total: action.payload.total,
          id: ID,
        };
      },
    );
  },
});

export default NewsSlice.reducer;

export * from './ThunkActions';
export * from './Selectors';
