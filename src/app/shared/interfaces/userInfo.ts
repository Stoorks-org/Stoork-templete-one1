export interface IUserRole {
  id: number;
  full_name: string;
  email: string;
  phone_number: null;
  address: Address[];
  image: string;
  username: null;
  super_admin: boolean;
  is_admin: boolean;
  supplier: Supplier;
}

export interface Address {
  id: number;
  user_id: number;
  type: string;
  region: null;
  main_adress: string;
  state: string;
  city: string;
  zip_code: null;
  is_default: number;
  secondery_adress: null;
  location_x: null;
  location_y: null;
  created_at: Date;
  updated_at: Date;
  phone: string;
}

export interface Supplier {
  id: number;
  user_id: number;
  email: string;
  region: string;
  full_name: string;
  company_name: string;
  phone_number: string;
  verified_at: null;
  category_id: null;
  employees: number;
  is_manufacturer: number;
  created_at: Date;
  updated_at: Date;
}
