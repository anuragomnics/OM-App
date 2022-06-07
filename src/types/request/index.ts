import {ShowOfferMembership} from '../responses/SettingResponseType';

export interface SignUpParams {
  salutation_id: number | undefined;
  title_id: number | undefined;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  password: string;
  password_confirmation: string;
}

export interface SignInParams {
  username: string;
  password: string;
}

export interface FontType {
  fontFamily: string;
  fontStyle: string;
  fontWeight: string;
  fontURL: string;
  base64: string;
}

export interface LoadAppFontsParams {
  fontName: string;
  appFonts: Array<FontType>;
}

export interface RequestParams {
  page?: number | null;
  offset?: number | null;
  limit?: number | null;
  keyword?: string | null;
  lang?: string | null;
  sort?: string | null;
  top?: number | null;
  category?: string;
  display_price?: number | null;
  display_duration?: number | null;
  display_number_of_chapter?: number | null;
  id?: number;
}

export interface FetchNewsRequestParams {
  page?: number | null;
  limit?: number | null;
  keyword?: string | null;
  top_news?: number | null;
  categories?: string | undefined;
  channel?: string | null;
  fields?: string | null;
}

export interface FetchEventsRequestParams {
  page?: number | null;
  limit?: number | null;
  keyword?: string | null;
  organizer_id?: number | null;
  top_event?: number | null;
}

export interface sendResetPasswordParams {
  email: string;
}
export interface updatePasswordParams {
  code: string;
  password: string;
  password_confirmation: string;
}

export interface SetNewPasswordParams {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface StoreMembershipOrderParams {
  setting_id: string | undefined;
  personal: {
    salutation_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    comment: string;
  };
  payment: string;
  session_id: string | undefined;
  legal_texts: Array<{
    id: string;
    identifier: string;
  }>;
  newsletter: {
    id: string;
    identifier: string;
    newsletter_list: string;
  };
  customer_type: string;
}
export interface PaymentDataParams {
  auto_renewing: boolean;
  currency_code: string;
  country_code: string;
  payment_state: number;
  promote_code?: string;
  start_date: number;
  end_date: number;
  sub_total?: number;
  total: number;
}

export interface LawTextDetailRouteParams {
  content: string;
  description: string;
  id: number;
  identifier: number;
  newsletter_list?: string | undefined;
  required?: boolean;
  type: string;
  legal_text_element?: string;
}

export type CheckoutRouteParams = ShowOfferMembership;
