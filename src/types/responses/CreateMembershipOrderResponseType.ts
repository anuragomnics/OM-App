export interface CreateMembershipOrderResponseType {
  errors: boolean;
  data: Order;
  message: string;
}

export interface Data {
  order: Order;
}

interface Order {
  order_id: number;
  total: number;
  options: {
    interval: string;
    free_trial_days: number;
  };
}

interface Log {
  ip: string;
  user_agent: string;
  legal_text: any[];
  newsletter: any;
  payment_verified: boolean;
}

interface Metadata {
  salutation_id: any;
}
