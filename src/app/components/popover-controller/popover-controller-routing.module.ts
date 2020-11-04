import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopoverControllerPage } from './popover-controller.page';

const routes: Routes = [
  {
    path: '',
    component: PopoverControllerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopoverControllerPageRoutingModule {}
