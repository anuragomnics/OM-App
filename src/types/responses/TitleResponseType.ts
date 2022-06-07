export interface TitleResponseType {
  errors: boolean;
  data: Array<TitleType>;
}

export interface TitleType {
  id: number;
  name: string;
}
