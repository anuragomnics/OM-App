export interface SingleCourseResponseType {
  data: SingleCourseType;
}

export interface SingleCourseType {
  id: number;
  groups: CourseGroupType[];
  title: string;
  description: string;
  hide_for_unauthorized: boolean;
  thumbnail: Thumbnail;
  chapters: ChapterType[];
  tariffs: Tariff[];
  status: string;
  show_progress_bar: boolean;
  watching_percent: number;
  watching_duration_total: string;
}

export interface CourseGroupType {
  name: string;
  slug: string;
}

interface Thumbnail {
  url: string;
  focus_point: FocusPoint;
  copyright: string;
  description: string;
}

interface FocusPoint {
  data_attribute: string;
  css_bg_position: string;
  retice_css: string;
}

export interface ChapterType {
  id: number;
  title: string;
  title_image: string;
  description: string;
  show_description: boolean;
  medias: Media[];
  tariffs: Tariff[];
  status: string;
  watch_duration_completed: number;
  watch_duration_total: number;
  watching_percent: number;
}

interface Media {
  id: number;
  slug: string;
  title: string;
  number_of_file: number;
  status: string;
  available_at: string;
  main_media_time: string;
  main_media_time_in_seconds: number;
  watching_status: string;
  duration: number;
}

interface Tariff {
  id: number;
  name: string;
  description?: string;
  price: string;
  display_price: string;
  booking_url: string;
}
