export interface ProfileResponseType {
  data: UserProfileType;
}

export interface UserProfileType {
  id: number | undefined;
  title: string | undefined;
  titles: Title[];
  title_selected: any;
  salutation: string | undefined;
  salutations: Salutation[];
  salutation_selected: number | undefined;
  phone: string | undefined;
  email: string | undefined;
  avatar: string | undefined;
  name: string | undefined;
  first_name: string | undefined;
  last_name: string | undefined;
  language: string | undefined;
  birthday: string | undefined;
  username: string | undefined;
  addresses: Address[];
  memberships: Membership[];
}

interface Title {
  id: number;
  name: string;
  type: string;
}

interface Salutation {
  id: number;
  name: string;
  type: string;
}

interface Address {
  id: number;
  address_company: string;
  address_name: string;
  customer_id: number;
  street: string;
  post_code: string;
  city: string;
  country_name: string;
  country_code: string;
  state_name: string;
  state_code: string;
  tax_id?: string;
}

interface Membership {
  membership_id: string;
  id: number;
  name: string;
  interval: string;
  price: string;
  start_date: string;
  end_date: string;
}
