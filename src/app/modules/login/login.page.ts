import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { AuthConstants } from '../../config/auth-constants';
import { BusinessService } from '../../services/plugins/business.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PopoverController } from '@ionic/angular';
import { PopoverControllerPage } from '../../components/popover-controller/popover-controller.page';
import { LoadingService } from '../../services/ui/loading.service';
import { ToastService } from '../../services/ui/toast.service';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { EventsService } from '../../services/events.service';

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
  showPassword: boolean = false;
  passwordIcon: String = 'eye-outline';

  error_credentias = "";

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    private translate: TranslateService,
    public popoverController: PopoverController,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private facebook: Facebook,
    private eventService: EventsService,
    private businessService: BusinessService,
    private sidemenu: MenuController,
    ) { 
    this.createForm();
    this.current_lenguaje();

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
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.sidemenu.swipeGesture(false);
  }

  // ionViewDidLeave() {
  //   this.sidemenu.swipeGesture(true);
  // }

  createForm(){
    this.loginForm = this.fb.group({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  Login(){
    if(this.loginForm.valid){
      const postData = this.loginForm.value;
      this.loadingService.loading_present();
      this.authService.login(postData,'login').subscribe((res:any)=>{
        this.loadingService.loading_dismiss();
        if(res.user){
          this.storageService.store(AuthConstants.GROUP, res.user.groups[0].id);
          this.storageService.store(AuthConstants.NAME, res.user.username);
          this.storageService.store(AuthConstants.AUTH, res.auth_token);

          this.businessService.set_token(res.auth_token);
          this.businessService.set_user_details(res.user);
          this.eventService.set_user_logeed();
          console.log( res.user.groups[0].id);
          if(res.user.groups[0].id == 2){
            this.router.navigate(['/main']);
          }
          else{
            this.router.navigate(['/ofertas']);
          }
          this.clear_fields();
        }
        else {
          this.toastService.presentToast("Incorrect username or password");
        }
      },
      (error: any)=>{
        if(error.error['non_field_errors']){
          this.translate.get('login.error_credentials').subscribe(
            value => {
              this.error_credentias = value;
            }
          )
          this.toastService.presentToast(this.error_credentias,'danger');
        }
        else{
          this.toastService.presentToast(error.error,'danger')
        }
        this.loadingService.loading_dismiss();
        ;
      });
    }
    else{
      this.loadingService.loading_dismiss();
    }
  }

  facebook_login(){
    this.facebook.login(['public_profile', 'email'])
    .then((res: FacebookLoginResponse)=>{
      // console.log('response',res);
    })
    .catch(e=>console.log('error',e));
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
      component: PopoverControllerPage,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true,
      componentProps: {"idioma":true,'labels':{"es":"español","en":"ingles"}}
    });
    return await popover.present();
  }

  social_login(){
    this.translate.get('coming_soon').subscribe(
      value => {
        this.proximamente = value;
      }
    )
    this.toastService.presentToast(this.proximamente);
  }

  toggle_password(){
    let icons = ['eye-outline', 'eye-off-outline'];
    this.showPassword = !this.showPassword;
    if(this.showPassword){
      this.passwordIcon = icons[0];
    }
    else{
      this.passwordIcon = icons[1];
    }
  }

  clear_fields(){
    this.loginForm.patchValue({
      'username': '',
      'password': '',
    });
  }

}
