import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appImageGallary]',
  standalone:false
})
export class ImageGallaryDirective {
  constructor(private el: ElementRef) {}

  @HostListener('click') public imageChange(): void {
    var src: any = this.el.nativeElement.src;
    var prev: any = document.getElementById('preview');
    prev.src = src;

    var imageSlide: any = document.querySelectorAll('.img-slide');

    imageSlide.forEach((img: any) => {
      img.classList.remove('active');
    });

    this.el.nativeElement.parentElement.classList.add('active');
  }
}
