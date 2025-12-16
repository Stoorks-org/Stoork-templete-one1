import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemsComponent } from './favorities/items/items.component';
import { ListsComponent } from './favorities/lists/lists.component';
import { FavoritiesComponent } from './favorities/favorities.component';
import { OpenListComponent } from './open-list/open-list.component';

const routes: Routes = [  

  {
  path: '',
  component: FavoritiesComponent,

  children: [
    {
      path: '',
      redirectTo: 'Items',
      pathMatch: 'full',
    },
    {
      path: 'Items',
      component: ItemsComponent,
    },
    {
      path: 'Items/:id',
      component: ItemsComponent,
    },
    {
      path: 'lists/Items/:id',
      component: ItemsComponent,
    },
    {
      path: 'lists',
      component: ListsComponent,
    },
    {
      path: 'lists/Open-List/:id',
      component: OpenListComponent,
    }
  ],
}
,
{
  path: 'Items/:id',
  component: ItemsComponent,
},
{
  path: 'lists',
  component: ListsComponent,
},
{
  path: 'Open-List/:id',
  component: OpenListComponent,
},
// { path: 'favorites',
//  component: FavoritiesComponent,}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FavoritiesRoutingModule { }