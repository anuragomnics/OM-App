export interface CoursesResponseType {
  data: CourseType[];
  has_more: boolean;
  total: number;
  layout_settings: LayoutSettings;
  errors: boolean;
}

export interface CourseType {
  id: number;
  group: any;
  groups: Group[];
  title: string;
  description: string;
  thumbnail: string;
  created_date: string;
  slug: string;
  status: string;
  top_course: boolean;
  duration?: string;
  chapters?: number;
  price?: string;
}

interface Group {
  id: number;
  name: string;
  slug: string;
}

interface LayoutSettings {
  overview_display_type: string;
  seo_info: SeoInfo;
}

interface SeoInfo {
  title: string;
  description: string;
  image: string;
  site_name: string;
}
