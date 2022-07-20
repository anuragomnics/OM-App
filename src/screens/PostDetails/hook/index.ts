import {useEffect, useState} from 'react';
import NewsService from '../../../services/PostsService';
import {PostType} from '../../../types/responses/PostsListResponseType';
import {SingleNewsType} from '../../../types/responses/SingleNewsResposeType';

export const useSinglePost = (id: number) => {
  const [post, setPost] = useState<PostType | undefined>(undefined);
  let isLoading: boolean = false;

  useEffect(() => {
    isLoading = true;
    async function fetchData() {
      try {
        const {postDetails} = await NewsService.fetchSinglePost(id);
        setPost(postDetails);
        isLoading = false;
      } catch (error) {
        isLoading = false;
        // eslint-disable-next-line no-console
        console.log('[ERROR] fetchData', error);
      }
    }

    fetchData();
  }, [id]);

  return {
    isLoading,
    postDetails: post,
  };
};
