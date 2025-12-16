export interface ICrtAddress {
  id?: number;
  type?: string;
  region: string;
  main_adress?: string;
  state?: string;
  city?: string;
  zip_code?: string;
  is_default?: boolean;
  phone?: number | string;
  secondery_adress?: string;
  location_x?: string;
  location_y?: string;
}
