export interface Iorder {
  items: items[];
  order?: order;
}
export interface order {
  address?: string;
  created_at?: string;
  id?: number;
  status?: string;
  total?: string;
  updated_at: string;
  user_id?: number;
  items: items[];
}
export interface items {
  id?: number;
  order_id?: number;
  product_id?: number;
  updated_at?: string;
}
