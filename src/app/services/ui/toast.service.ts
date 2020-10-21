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
  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      duration: 3000,
      position: "bottom",
      color: "light"
    });
    toast.present();
  }
}
