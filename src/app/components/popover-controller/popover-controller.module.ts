import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PopoverControllerPageRoutingModule } from './popover-controller-routing.module';

import { PopoverControllerPage } from './popover-controller.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopoverControllerPageRoutingModule
  ],
  declarations: [PopoverControllerPage]
})
export class PopoverControllerPageModule {}
