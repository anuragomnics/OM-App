export interface NewsResponseType {
  data: NewsType[];
  has_more: boolean;
  total: number;
  layout_settings: LayoutSettings;
  errors: boolean;
}

export interface NewsType {
  id: number;
  title: string;
  introduction: string;
  description: string;
  available_date: string;
  primary_image: string;
  authors: Author[];
  // categories:Array<any>;
  slug: string;
  top_news: boolean;
}

interface Author {
  id: number;
  name: string;
  avatar: string;
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
