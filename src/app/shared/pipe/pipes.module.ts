import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchAdminPipe } from './search-admin.pipe';
import { SearchPipe } from './search.pipe';
@NgModule({
  imports: [CommonModule],
  declarations: [SearchAdminPipe, SearchPipe],
  exports: [SearchAdminPipe, SearchPipe],
})
export class PipesModule {}
