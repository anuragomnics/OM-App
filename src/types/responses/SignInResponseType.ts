export interface SignInResponseType {
  token_type: string | undefined;
  expires_in: number | undefined;
  access_token: string | undefined;
  refresh_token: string | undefined;
  sub_plans: any[];
  is_legally_register: number | undefined;
  first_name?: string | undefined;
  last_name?: string | undefined;
  avatar?: string | undefined;
  birthday?: string | undefined;
  user_id?: number | undefined;
}
