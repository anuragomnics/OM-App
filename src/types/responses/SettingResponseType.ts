export interface SettingResponseType {
  generalDetails: SettingTypeNew;
  message: string;
}

export interface DashboardSettingResponseType {
  pageSettingsDetails: PageSettingsDetailsType;
}
export interface PageSettingsDetailsType {
  id: number;
  parents_id: number | null;
  name: string;
  sections: Array<
    | BannerSectionType
    | PostsListSectionType
    | NewsLetterSectionType
    | EventsListSectionType
  >;
}

export interface SettingTypeNew {
  font: string;
  accent_color: string;
  accent_text_color: string;
  accent_color_dark_mode: string;
  accent_text_color_dark_mode: string;
  success_alert: string;
  warning_alert: string;
  error_alert: string;
  splash_screen_url: string | null;
  main_logo_url: string | null;
  main_logo_monochrome_url: string | null;
  impression: 0 | 1;
  impression_text: string;
  impression_id: number | null;
  data_privacy: 0 | 1;
  data_privacy_text: string;
  data_privacy_id: number | null;
  terms_of_use: 0 | 1;
  terms_of_use_text: string;
  terms_of_use_id: number | null;
  posts_general_settings: postsGeneralSettingsType;
}

export interface postsGeneralSettingsType {
  posts_details_date_time_format: 'none' | 'date' | 'date_time';
  posts_details_display_style: 'style-1' | 'style-2';
}

export interface SettingType {
  logo_color_ci: LogoColorCi | undefined;
  on_boarding: OnBoarding | undefined;
  settings: Settings | undefined;
  navigations: {
    drawer: DrawerNavigation[];
    bar: BarNavigation[];
  };
}

export interface CourseListSettings {
  type: string;
  title: string;
  filter_category: string;
  top: number;
  display_search_and_filter: boolean;
  display_the_search_bar: boolean;
  display_the_section_of_category: boolean;
  pagination: boolean;
  switch_between_views: boolean;
  display_price: boolean;
  display_number_of_chapter: boolean;
  display_duration: boolean;
  list_background_color_code: string;
}

export interface NewsListSettings {
  type: string;
  title: string;
  filter_category: string;
  filter_tags?: string;
  top: number;
  limit?: number;
  display_search_and_filter: boolean;
  display_the_search_bar: boolean;
  display_the_section_of_category: boolean;
  pagination: boolean;
  switch_between_views: boolean;
  list_background_color_code: string;
  item_number_per_page: number;
  offset: number;
  default_view: string;
}

export interface EventsListSettings {
  type: string;
  title: string;
  top: number;
  limit?: number;
  display_search_and_filter: boolean;
  display_the_search_bar: boolean;
  display_the_selection_of_options: boolean;
  pagination: boolean;
  switch_between_views: boolean;
  list_background_color_code: string;
}

export interface BannerSectionType {
  id: number;
  type: string;
  background_type: 'image' | 'color';
  background_image_url: string | null;
  background_color: string;
  title: string;
  title_size_small: number;
  title_size_medium: number;
  title_size_large: number;
  title_text_color: string;
  title_layer_color: string;
  title_layer_transparency: number;
  sub_title: string;
  sub_title_size_small: number;
  sub_title_size_medium: number;
  sub_title_size_large: number;
  sub_title_text_color: string;
  sub_title_layer_color: string;
  sub_title_layer_transparency: number;
  destination_button: 0 | 1;
  destination_id: number | null;
  destination_url: string | null;
}

export interface NewsLetterSectionType {
  id: number;
  type: 'NewsLetter';
  background_type: 'image' | 'color';
  background_image_id: number | null;
  background_color: string;
  title: string;
  title_size_small: number;
  title_size_medium: number;
  title_size_large: number;
  title_text_color: string;
  title_layer_color: string;
  title_layer_transparency: number;
  legal_text_id: number | null;
  extra_enable: 0 | 1;
  extra_required: 0 | 1;
}

export interface PostsListSectionType {
  id: number;
  type: 'post-list';
  title: string;
  default_view: string;
  switch_between_views: 0 | 1;
  pagination: 0 | 1;
  items_per_page: number | null;
  sorting: string;
  search_bar: 0 | 1;
  offset: number | null;
  option_for_featured: string;
  rule_type: string;
  groups: string;
  groups_condition: string;
  categories: string;
  categories_condition: string;
  tags: string;
  tags_condition: string;
}

export interface EventsListSectionType {
  id: number;
  type: 'event-list';
  title: string;
  default_view: string;
  switch_between_views: 0 | 1;
  pagination: 0 | 1;
  items_per_page: number | null;
  search_bar: 0 | 1;
  offset: number | null;
  option_for_featured: string;
  rule_type: string;
  groups: string;
  groups_condition: string;
  categories: string;
  categories_condition: string;
  tags: string;
  tags_condition: string;
  sorting: string;
}

export interface PostsCarouselSectionType {
  id: number;
  type: 'post-carousel';
  title: string;
  offset: number | null;
  option_for_featured: string;
  total_items: number;
  sorting: string;
  maximum_items_per_carousel: string;
  rule_type: string;
  groups: string;
  groups_condition: string;
  categories: string;
  categories_condition: string;
  tags: string;
  tags_condition: string;
}

export interface CourseSlider {
  type: string;
  title: string;
  item_number_per_slider: number;
  courses: Array<Course>;
}

export interface NewsNavigationBarType {
  type: string;
  title: string;
  banner: Array<Banner>;
}

export interface EventSlider {
  type: string;
  title: string;
  item_number_per_slider: number;
  events: Array<Course>;
}

export interface Course {
  id: number;
  name: string;
  type: string;
  description: string;
  image: string;
  slug: string;
}

interface LogoColorCi {
  font_web: string;
  font_app: string;
  color_accent: string;
  color_accent_text_color: string;
  color_success_alert: any;
  color_warning_alert: string;
  color_error_alert: string;
  color_navigation_top_bar_background: string;
  color_navigation_top_bar_text: string;
  color_navigation_background: string;
  color_navigation_text: string;
  color_footer_background: string;
  color_footer_text: string;
  color_copyright_bar_background: string;
  color_copyright_bar_text: string;
  logo_rectangle_display_size_website: string;
  logo_rectangle_full_path: string;
  logo_square_full_path: string;
  logo_favicon: string;
  logo_app_full_path: string;
  logo_app_start_full_path: string;
  logo_app_splash_screen_full_path: string;
}

interface OnBoarding {
  enabled: boolean;
  show_offer: boolean;
  show_offer_memberships: ShowOfferMembership[];
  steps: Step[];
}

export interface ShowOfferMembership {
  id: number;
  product_id_google_pay: string;
  product_id_apple_pay: string;
  product_type: string;
  name: string;
  description: string;
  price: number;
  old_price: number;
  display_price: string;
  display_old_price: string;
  interval: string;
  image_url: string;
}

export interface Step {
  sorting: number;
  title: string;
  description: string;
  picture_full_path: string;
}

interface Settings {
  sign_up: boolean;
  sign_in: boolean;
}

export interface DrawerNavigation {
  id: number;
  name: string;
  name_highlight_in_app: boolean;
  link_icon: string;
  link_type: string;
  full_url?: string;
  open_in_new_tab: boolean;
  default_page: boolean;
  children?: DrawerNavigation[];
}

export interface BarNavigation {
  id: number;
  name: string;
  full_url: string;
  open_in_new_tab: boolean;
  link_type: string;
  link_icon: string;
}

export interface Banner {
  destination_page: DestinationPage;
  category: string;
}

export interface DestinationPage {
  id: string;
  type: string;
  name: string;
}
