import { User } from './user';

export interface Message {
  id: number;
  content: string;
  user: User;
  file?: File;
}
export interface File {
  path: string;
}
export interface ProductImage {
  imagefile:File| any;
  path:string|any;
  
}