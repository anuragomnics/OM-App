export interface LegalTextDetailResponseType {
  legalTextDetail: LegalTextType;
  message: string;
}

export interface LegalTextType {
  id: number;
  version_id: number;
  name: string;
  title: string;
  description: string;
  element: string;
  is_published: 0 | 1;
  is_active: 0 | 1;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: null;
}
