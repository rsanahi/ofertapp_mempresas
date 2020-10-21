import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewofertPage } from './newofert.page';

const routes: Routes = [
  {
    path: '',
    component: NewofertPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewofertPageRoutingModule {}
