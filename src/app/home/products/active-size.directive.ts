import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appActiveSize]',
  standalone:false
})
export class ActiveSizeDirective {
  @Output() selectedId: EventEmitter<string> = new EventEmitter<string>();
  constructor(private el: ElementRef) {}
  // @HostListener('click') public imageChange(): void {
  //   // var src: any = this.el.nativeElement.src;
  //   // var prev: any = document.getElementById('preview');
  //   // prev.src = src;

  //   var imageSlide: any = document.querySelectorAll('.size');

  //   imageSlide.forEach((img: any) => {
  //     img.classList.remove('active');
  //   });

  //   this.el.nativeElement.classList.add('active');
  //   const elementId = this.el.nativeElement.id;
  //   this.selectedId.emit(elementId);
  // }
//   @HostListener('click') public imageChange(): void {
//   const parent = this.el.nativeElement.closest('.mainsize');
//   const siblings = parent.querySelectorAll('.size');

//   siblings.forEach((el: HTMLElement) => {
//     el.classList.remove('active');
//   });

//   this.el.nativeElement.classList.add('active');
//   const elementId = this.el.nativeElement.id;
//   this.selectedId.emit(elementId);
// }
@HostListener('click') public imageChange(): void {
  const parent = this.el.nativeElement.closest('.mainsize');
  const siblings = parent.querySelectorAll('.size');

  const isActive = this.el.nativeElement.classList.contains('active');

  // Clear all active classes in the current row
  siblings.forEach((el: HTMLElement) => {
    el.classList.remove('active');
  });

  // If it wasn't active before, make it active
  if (!isActive) {
    this.el.nativeElement.classList.add('active');
    const elementId = this.el.nativeElement.id;
    this.selectedId.emit(elementId);
  } else {
    // If it was already active, emit a null or empty selection if needed
    this.selectedId.emit('');
  }
}
}
