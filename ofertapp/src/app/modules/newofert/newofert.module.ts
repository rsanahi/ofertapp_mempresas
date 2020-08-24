import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewofertPageRoutingModule } from './newofert-routing.module';

import { NewofertPage } from './newofert.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewofertPageRoutingModule
  ],
  declarations: [NewofertPage]
})
export class NewofertPageModule {}
