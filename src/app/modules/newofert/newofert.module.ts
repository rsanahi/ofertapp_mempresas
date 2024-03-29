import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewofertPageRoutingModule } from './newofert-routing.module';

import { NewofertPage } from './newofert.page';

import { ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewofertPageRoutingModule,
    TranslateModule,
    ReactiveFormsModule,
  ],
  declarations: [NewofertPage]
})
export class NewofertPageModule {}
