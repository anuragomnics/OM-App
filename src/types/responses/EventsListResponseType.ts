export interface EventsListResponseType {
  eventDetails: EventType[];
  paginationDetails: PaginationDetailsType;
}

export interface SingleEventResponseType {
  eventDetails: EventDetailsType;
}

export interface EventType {
  id: number;
  title: string;
  sub_title: null | string;
  description: null | string;
  event_type_name: string;
  event_mode_name: string;
  status_name: string;
  event_image_url: string;
  start_date: string;
  start_date_UTC: string;
  end_date: string;
  end_date_UTC: string;
  event_image_copyright_text: string | null;
  top_event: 0 | 1;
}

export interface EventDetailsType {
  id: number;
  event_type_id: number;
  event_type_name: string;
  event_mode_id: number;
  event_mode_name: 'Free' | 'Payed';
  status_id: number;
  status_name: string;
  title: string;
  sub_title: string | null;
  description: string | null;
  event_image_id: number;
  event_image_url: string;
  top_event: 0 | 1;
  top_event_expiration: string | null;
  start_date: string;
  end_date: string;
  registration_start_date: string | null;
  registration_end_date: string | null;
  location: 0 | 1;
  address_1: string | null;
  address_2: string | null;
  zip_code: string | null;
  city: string | null;
  country_id: number | null;
  county_name: string | null;
  meeting_url: string | null;
  contact_person_name: string | null;
  contact_person_email: string | null;
  contact_person_phone: string | null;
  contact_person_remarks: string | null;
  host: number;
  partner_details: {
    host_name: null;
    host_email: null;
    host_image_id: null;
    host_image_url: null;
  };
  groups: [];
  categories: [];
  tags: [];
}

export interface PaginationDetailsType {
  current_page: number;
  number_of_pages: number;
  total_items: number;
  actual_total_items: number;
  next_page: string;
}
