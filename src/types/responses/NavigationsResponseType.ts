export interface NavigationsResponseType {
  navigationMenu: NavigationType[];
  message: string;
}

export interface NavigationType {
  id: number;
  name: string;
  default_page: 0 | 1;
  page_type: 'content' | 'link';
  page_highlight_app: 0 | 1;
  page_icon: string | null;
  page_icon_monochrome: string | null;
  link_url: string | null;
  children: NavigationType[];
}
