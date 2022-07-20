export interface PostsListResponseType {
  postDetails: PostType[];
  paginationDetails: PaginationDetailsType;
}

export interface PostType {
  id: number;
  title: string;
  introduction: string;
  description: string;
  post_type: 'image' | 'audio' | 'video';
  post_media_url: string;
  post_thumbnail_url: string;
  post_thumbnail_copyright_text: string | null;
  post_media_copyright_text: string | null;
  post_media_duration: null | number;
  top_post: 0 | 1;
  published_at: string | null;
  shareable_post: 0 | 1;
  shareable_description: string | null;
  shareable_callback_url: string | null;
}

export interface PaginationDetailsType {
  current_page: number;
  number_of_pages: number;
  total_items: number;
  actual_total_items: number;
  next_page: string;
}
