import {createSlice, PayloadAction, createAction} from '@reduxjs/toolkit';

// custom
import {fetchAllPosts, fetchPosts} from './ThunkActions';
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

export interface NewsList {
  data: NewsType[];
  has_more: boolean;
  total: number;
  id?: number;
}

interface PostListObj {
  [key: string]: PostType[];
}
interface PostListPaginationObj {
  [key: string]: PaginationDetailsType;
}

interface Store {
  postsList: PostListObj;
  postsPaginationDetails: PostListPaginationObj;
  allPosts: PostType[];
  VideoPlayerContent: PostType | undefined;
}

const initialState: Store = {
  postsList: {},
  postsPaginationDetails: {},
  allPosts: [],
  VideoPlayerContent: undefined,
};

export const resetNewsList = createAction('reset-news-list');

export const openVideoPlayer = createAction<PostType>('open-video-player');
export const closeVideoPlayer = createAction('close-video-player');

const NewsSlice = createSlice({
  name: 'NEWS_SLICE',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(resetNewsList, () => initialState);
    builder.addCase(
      fetchAllPosts.fulfilled,
      (state, action: PayloadAction<PostsListResponseType>) => {
        //@ts-ignore
        state.allPosts = action.payload.postDetails;
      },
    );
    builder.addCase(
      fetchPosts.fulfilled,
      (state, action: PayloadAction<PostsListResponseType>) => {
        //@ts-ignore
        const ID = action?.meta?.arg?.id;
        state.postsList[ID] = action.payload.postDetails;
        state.postsPaginationDetails[ID] = action.payload.paginationDetails;
      },
    );
    builder.addCase(openVideoPlayer, (state, action) => {
      state.VideoPlayerContent = action.payload;
    });
    builder.addCase(closeVideoPlayer, (state, action) => {
      state.VideoPlayerContent = undefined;
    });
  },
});

export default NewsSlice.reducer;

export * from './ThunkActions';
export * from './Selectors';
