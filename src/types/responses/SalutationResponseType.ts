export interface SalutationResponseType {
  errors: boolean;
  data: Array<SalutationType>;
}

export interface SalutationType {
  id: number;
  name: string;
}
