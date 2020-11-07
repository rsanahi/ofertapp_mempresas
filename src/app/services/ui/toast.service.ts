import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    public toastController: ToastController,
  ) { }

  // ion toast
  async presentToast(text, color="light", pos="bottom") {

    if(pos==="bottom"){
      const toast = await this.toastController.create({
        message: text,
        duration: 3000,
        position: "bottom",
        color: color
      });

      toast.present();
    }

    else if(pos==="top"){
      const toast = await this.toastController.create({
        message: text,
        duration: 3000,
        position: "top",
        color: color
      });

      toast.present();
    }

    else if(pos==="middle"){
      const toast = await this.toastController.create({
        message: text,
        duration: 3000,
        position: "middle",
        color: color
      });

      toast.present();
    }
  }
}
