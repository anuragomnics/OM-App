export interface CheckoutSettingResponseType {
  data: CheckoutSettingType;
}

export interface CheckoutSettingType {
  extra_field_consumer: ExtraField;
  extra_field_company: ExtraField;
  setting_id: number;
  law_texts: LawText[];
  collection_newsletter: CollectionNewsletter;
  confirm_message: ConfirmMessage;
}

export interface ExtraField {
  [key: string]: CheckoutSettingField;
}

export interface CheckoutSettingField {
  enable: boolean;
  required: boolean;
  type: string;
}

export interface LawText {
  sorting: number;
  required: boolean;
  legal_text: LegalText;
}

interface LegalText {
  id: number;
  legal_text_element: string;
  description: string;
  content: string;
  identifier: number;
}

interface CollectionNewsletter {
  enable: boolean;
  legal_text: LegalText;
  newsletter_list: string;
}

interface ConfirmMessage {
  create_new_user_message: string;
  user_exist_message: string;
}
