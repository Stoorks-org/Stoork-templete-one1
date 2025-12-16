import { ToastModule } from 'primeng/toast';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritiesComponent } from './favorities/favorities.component';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { ItemsComponent } from './favorities/items/items.component';
import { ListsComponent } from './favorities/lists/lists.component';
import { OpenListComponent } from './open-list/open-list.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonsDirective } from '../shared/direactive/buttons.directive';
import { FavoritiesRoutingModule } from './favorities-routing.module';

@NgModule({
  declarations: [
    FavoritiesComponent,
    ItemsComponent,
    ListsComponent,
    OpenListComponent,
    ButtonsDirective
  ],
  imports: [
    CommonModule,
    BreadcrumbModule,
    ReactiveFormsModule,
    DialogModule,
    OverlayPanelModule,
    PaginatorModule,
    ToastModule,
    FavoritiesRoutingModule,
    TranslateModule.forChild({ extend: true }),
  ],
  exports: [ButtonsDirective]

})
export class FavoritiesModule { }
