import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
  standalone:false
})
export class CategoryComponent {
 @Input() categories: any[] = [];
  @Input() isLoadingcategories=true;
}
