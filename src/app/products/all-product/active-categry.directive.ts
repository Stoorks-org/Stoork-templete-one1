import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appActiveCategry]',
  standalone:false
})
export class ActiveCategryDirective {
  @Output() selectedCatIds: EventEmitter<string> = new EventEmitter<string>();
  @Output() unselectedCatIds: EventEmitter<string> = new EventEmitter<string>();
  constructor(private el: ElementRef) {}
  @HostListener('click') public imageChange(): void {
    console.log(this.el.nativeElement.classList.value);
    if (
      this.el.nativeElement.classList.value ==
        'filterList1 ng-star-inserted active' ||
      this.el.nativeElement.classList.value == 'filterList active'
    ) {
      this.el.nativeElement.classList.remove('active');
      const elementId = this.el.nativeElement.id;
      this.unselectedCatIds.emit(elementId);
    } else {
      this.el.nativeElement.classList.add('active');
      console.log(this.el.nativeElement.classList.value);
      const elementId = this.el.nativeElement.id;
      this.selectedCatIds.emit(elementId);
    }
  }
}
