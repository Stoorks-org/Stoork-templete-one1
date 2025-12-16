import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'whatsDate',
})
export class WhatsDatePipe implements PipeTransform {
  transform(value: any): string {
    const datePipe = new DatePipe('en-US');

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (value instanceof Date) {
      if (this.isToday(value)) {
        return 'Today at ' + datePipe.transform(value, 'shortTime');
      } else if (this.isYesterday(value)) {
        return 'Yesterday at ' + datePipe.transform(value, 'shortTime');
      } else {
        return (
          datePipe.transform(value, 'MMM d, y') +
          ' at ' +
          datePipe.transform(value, 'shortTime')
        );
      }
    }

    return '';
  }

  private isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  private isYesterday(date: Date): boolean {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    );
  }
}
