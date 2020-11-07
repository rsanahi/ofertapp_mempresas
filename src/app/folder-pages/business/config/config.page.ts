import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EventsService } from '../../../services/events.service';
import { ToastService } from '../../../services/ui/toast.service';
import { PopoverController } from '@ionic/angular';
import { PopoverControllerPage } from '../../../components/popover-controller/popover-controller.page';
import { AlertService } from '../../../services/ui/alert.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
})
export class ConfigPage implements OnInit {

  lenguaje: String;
  change_password: "";

  constructor(
    private translate: TranslateService,
    private eventService: EventsService,
    private toastService: ToastService,
    public popoverController: PopoverController,
    private alertService: AlertService,
  ) { 
    this.eventService.getLenguajeObservable().subscribe((res)=>{
      if(res=="es"){
        this.translate.get('spanish').subscribe(
          value => {
            this.lenguaje = value;
          }
        )
      }
      else{
        this.translate.get('english').subscribe(
          value => {
            this.lenguaje = value;
          }
        )
      }
    });

    this.translate.get('settings.change_password').subscribe(
      value => {
        this.change_password = value;
      }
    )

    this.current_lenguaje();
  }

  ngOnInit() {
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverControllerPage,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true,
      componentProps: {"idioma":true,'labels':{"es":"español","en":"ingles"}}
    });
    return await popover.present();
  }

  current_lenguaje(){
    let variable = this.translate.getDefaultLang();

    if(variable=='es'){
      this.translate.get('spanish').subscribe(
        value => {
          this.lenguaje = value;
        }
      )
    }
    else{
      this.translate.get('english').subscribe(
        value => {
          this.lenguaje = value;
        }
      )
    }
  }

  cambiar_password(){
    let data = {
      cssClass: 'my-custom-class',
      header: this.change_password,
      inputs: [
        {
          name: 'current_password',
          type: 'password',
          id: 'current_password',
          placeholder: 'Current Password',
          cssClass: 'specialClass',
          attributes: {
            maxlength: 40
          }
        },
        {
          name: 'new_password',
          type: 'password',
          id: 'new_password',
          cssClass: 'specialClass',
          placeholder: 'New Password',
          attributes: {
            maxlength: 40
          }
        },
        {
          name: 'confirm_password',
          type: 'password',
          id: 'confirm_password',
          cssClass: 'specialClass',
          placeholder: 'Confirm Password',
          attributes: {
            maxlength: 40
          }
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Cambiar',
          handler: (data) => {
            console.log(data);
            let if_valid = this.validar_prom_password(data);
            if(if_valid){
              this.cambiar_password_confirm(data);
            }
            else{
              this.toastService.presentToast("All fields are required", "warning", "top");
              return false;
            }
          }
        }
      ]
    }
    this.alertService.presentAlertPrompt(data);
  }

  validar_prom_password(data){
    console.log(data.current_password, data.new_password, data.confirm_password);
    if(data.current_password != "" && data.new_password != "" && data.confirm_password != ""){
      return true;
    }
    return false;
  }

  cambiar_password_confirm(data){
    console.log("cambiando jajajja");
  }
}
