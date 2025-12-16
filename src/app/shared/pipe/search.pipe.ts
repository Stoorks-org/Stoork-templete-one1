import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  // transform(items: any[], searchText: string): any[] {
  //   if (!items) {
  //     return [];
  //   }
  //   if (!searchText) {
  //     return items;
  //   }

  //   searchText = searchText.toLocaleLowerCase();
  //   return items.filter((it) => {
  //     return it.toLocaleLowerCase().includes(searchText);
  //   });
  // }

  transform(value: any[], filterString: string, propName: string): any[] {
    const result: any = [];

    if (!value || filterString === '' || propName === '') {
      return value;
    }

    value.forEach((item: any) => {
      if (
        item[propName].trim().toLowerCase().includes(filterString.toLowerCase())
      ) {
        result.push(item);
      }
    });

    return result;
  }
}
