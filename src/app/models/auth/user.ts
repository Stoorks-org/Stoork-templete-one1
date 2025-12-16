export interface IuserInfo {
  id: number;
  name: string;
  full_name: string;
  email: string;
  phone: number | string | null;
  avatar: string | null;
  provider_id: number | string | null;
  created_at: Date | string;
  updated_at: Date | string;
  token?: string;
}
