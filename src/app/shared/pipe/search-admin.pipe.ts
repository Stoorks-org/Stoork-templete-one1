import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchAdmin',
})
export class SearchAdminPipe implements PipeTransform {
  transform(array: any, args: any): any {
    if (!array) return null; //if no data return  null
    if (!args) return array; //if no search return data
    args = args.toLowerCase();
    //filter data if search found
    return array.filter((item: any) => {
      return JSON.stringify(item).toLowerCase().includes(args);
    });
  }
}
