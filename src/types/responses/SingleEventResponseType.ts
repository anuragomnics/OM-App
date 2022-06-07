export interface SingleEventResponseType {
  data: SingleEventType;
}

export interface SingleEventType {
  id: number;
  title: string;
  description: string;
  image: string;
  image_copyright: string;
  organizer: Organiser;
  event_date: string;
  modules: ModuleType[];
  type: string;
  agenda: string;
}

interface Organiser {
  id: number;
  name: string;
  image: string;
  slug: string;
}

export interface ModuleType {
  id: string;
  title: string;
  event_date: string;
  time_from: string;
  time_to: string;
  agenda: string;
  place_id: number;
  place: Place;
  max_participants: number;
  start_at: string;
  end_at: string;
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
