//import * as cuid from 'cuid';
import { v4 as uuidv4 } from 'uuid';
// export interface BasketItem{
//     product_id:number;
//     count : number;
//     product_variant_id  : number;
//     size_id:number
// }
export interface cart {
    cart_id:string;
    product_id:number;
    count : number;
    product_variant_id  : number;
    size_id:number
}

export class cart implements cart{
    //cart_id=cuid();
    cart_id=uuidv4();
    product_id=1
    count=1;
    product_variant_id=1;
    size_id=1
}