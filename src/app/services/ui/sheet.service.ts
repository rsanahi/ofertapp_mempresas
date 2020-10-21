import { Injectable } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
@Injectable({
  providedIn: 'root'
})
export class SheetService {

  title: 'title';

  shee_elements = [];

  constructor(
    public actionSheetController: ActionSheetController,
    private translate: TranslateService
  ) { }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: this.title,
      cssClass: 'my-custom-class',
      buttons: this.shee_elements
    });
    await actionSheet.present();
  }

  generate_sheet(title, data){
    this.title = title;
    this.shee_elements = data;
    this.presentActionSheet();
  }

}
