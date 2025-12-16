import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appButtons]',
})
export class ButtonsDirective {
  @Output() selectedId: EventEmitter<string> = new EventEmitter<string>();
  @Input('appCustomDirective') customClass: string = '';
  constructor(private el: ElementRef) {}
  @HostListener('click') public imageChange(): void {
    // var imageSlide: any = document.querySelectorAll('.btn');
    var imageSlide: any = document.querySelectorAll(this.customClass);
    imageSlide.forEach((img: any) => {
      img.classList.remove('active');
    });
    this.el.nativeElement.classList.add('active');
    const elementId = this.el.nativeElement.id;
    this.selectedId.emit(elementId);
  }
}
