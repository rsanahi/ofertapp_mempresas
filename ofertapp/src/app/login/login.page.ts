import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';
import { AuthConstants } from '../config/auth-constants';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from '../components/popover/popover.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;

  // variables
  proximamente: String;
  lenguaje: String;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    private translate: TranslateService,
    public toastController: ToastController,
    public popoverController: PopoverController
    ) { 
    this.createForm();
    this.current_lenguaje();
  }

  ngOnInit() {
  }

  createForm(){
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  Login(){
    if(this.loginForm.valid){
      const postData = this.loginForm.value;
      this.authService.login(postData).subscribe((res:any)=>{
        if(res.user){
          this.storageService.store(AuthConstants.AUTH, res.auth_token);
          this.storageService.store(AuthConstants.GROUP, res.user.groups[0].id);
          this.storageService.store(AuthConstants.NAME, res.user.username);
          this.router.navigate(['/folder/Inbox'])
        }
        else {
          console.log('Incorrect username or password');
        }
      },
      (error: any)=>{
        this.presentToast(error.message);
      });
    }
    else{
      console.log(this.loginForm)
    }
  }

  current_lenguaje(){
    let variable = this.translate.getDefaultLang();

    if(variable=='es'){
      this.translate.get('spanish').subscribe(
        value => {
          this.proximamente = value;
        }
      )
    }
    else{
      this.translate.get('english').subscribe(
        value => {
          this.proximamente = value;
        }
      )
    }
  }

  //ion popover
  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true,
      componentProps: {"idioma":true,'labels':{"es":"español","en":"ingles"}}
    });
    return await popover.present();
  }

  // ion toast
  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      duration: 2000,
      position: "bottom",
      color: "light"
    });
    toast.present();
  }

  social_login(){
    this.translate.get('coming_soon').subscribe(
      value => {
        this.proximamente = value;
      }
    )
    this.presentToast(this.proximamente);
  }

}
