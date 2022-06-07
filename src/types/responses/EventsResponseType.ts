export interface EventsResponseType {
  data: EventType[];
  has_more: boolean;
  total: number;
  layout_settings: LayoutSettings;
  errors: boolean;
}

export interface EventType {
  id: number;
  title: string;
  description: string;
  available_date: string;
  full_event_date: string;
  image: string;
  organizer: Organiser;
  price: string;
  display_price: string;
  symbol_currency: string;
  places: Place[];
  slug: string;
  top_event: boolean;
}

interface Organiser {
  id: number;
  name: string;
  image: string;
  slug: string;
}

interface Place {
  name: string;
  street: string;
  zip_code: string;
  city: string;
  country_code: string;
  state_code: string;
  state_name: string;
  country_name: string;
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
