import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appMuliSelectSize]',
})
export class MuliSelectSizeDirective {
  @Output() selectedIds: EventEmitter<string> = new EventEmitter<string>();
  @Output() unselectedIds: EventEmitter<string> = new EventEmitter<string>();
  constructor(private el: ElementRef) {}
  @HostListener('click') public imageChange(): void {
    if (this.el.nativeElement.classList.value == 'size active') {
      this.el.nativeElement.classList.remove('active');
      const elementId = this.el.nativeElement.id;
      this.unselectedIds.emit(elementId);
    } else {
      this.el.nativeElement.classList.add('active');

      const elementId = this.el.nativeElement.id;
      this.selectedIds.emit(elementId);
    }
  }
}
