import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  isLoading = false;

  constructor(
    private loadingController: LoadingController
  ) { }

  async loading_present() {
    this.isLoading = true;
    return await this.loadingController.create({
      message: 'Please wait ...',
      spinner: 'circles' 
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort laoding'));
        }
      });
    });
  }

  async loading_dismiss() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() => console.log(''));
  }
}
