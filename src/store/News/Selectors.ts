import {createDraftSafeSelector} from '@reduxjs/toolkit';
import {RootState} from '../../store';

const selectSelf = (state: RootState) => state;

export const PostsListSelector = () =>
  createDraftSafeSelector(selectSelf, state => {
    return state.news.postsList;
  });

export const PostsPaginationDetailsSelector = () =>
  createDraftSafeSelector(selectSelf, state => {
    return state.news.postsPaginationDetails;
  });

export const AllPostsListSelector = () =>
  createDraftSafeSelector(selectSelf, state => {
    return state.news.allPosts;
  });

export const VideoPlayerContentSelector = () =>
  createDraftSafeSelector(selectSelf, state => {
    return state.news.VideoPlayerContent;
  });
