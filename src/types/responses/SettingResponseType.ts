export interface SettingResponseType {
  data: SettingType;
}

export interface DashboardSettingResponseType {
  data: Array<
    StaticSlider | CourseSlider | CourseListSettings | NewsNavigationBarType
  >;
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

export interface StaticSlider {
  type: string;
  background_type: string;
  background_image?: string;
  background_color?: string;
  title: string;
  title_size_medium: string;
  title_size_large: string;
  title_text_color: string;
  title_layer_color: string;
  title_layer_transparency: string;
  subtitle?: string;
  subtitle_size_small: string;
  subtitle_size_big: string;
  subtitle_text_color: string;
  subtitle_layer_color: string;
  subtitle_layer_transparency: string;
  destination_button_status?: string;
  destination_button_link_page?: {
    id: number;
    type: string;
    name: string;
  };
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
