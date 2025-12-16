export interface productdetails {
  date?: Date;
  id?: number;
  name?: string;
  description?: string;
  status?: boolean;
  stock_count?: number;
  rating?: number;
  price?: Price;
  image?: Image;
}
export interface Price {
  id?: number;
  min?: number;
  max?: number;
  price?: number;
  order?: number;
}
export interface Image {
  id?: number;
  path?: string;
  order?: number;
  is_main?: number;
}
