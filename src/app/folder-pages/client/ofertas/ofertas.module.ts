import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfertasPageRoutingModule } from './ofertas-routing.module';

import { OfertasPage } from './ofertas.page';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfertasPageRoutingModule,
    TranslateModule
  ],
  declarations: [OfertasPage]
})
export class OfertasPageModule {}
