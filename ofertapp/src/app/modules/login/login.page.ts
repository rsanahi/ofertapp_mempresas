import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { AuthConstants } from '../../config/auth-constants';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from '../../components/popover/popover.component';
import { LoadingService } from '../../services/ui/loading.service';
import { ToastService } from '../../services/ui/toast.service';
import { HttpService } from '../../services/http.service';
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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    private translate: TranslateService,
    public popoverController: PopoverController,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private httpSevice: HttpService,
    private facebook: Facebook,
    private eventService: EventsService,
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

          this.router.navigate(['/folder/Inbox']);
        }
        else {
          console.log('Incorrect username or password');
        }
        console.log(res);
      },
      (error: any)=>{
        this.loadingService.loading_dismiss();
        this.toastService.presentToast("Network connection error.");
        console.log(error);
      });
    }
    else{
      this.loadingService.loading_dismiss();
    }
  }

  facebook_login(){
    this.facebook.login(['public_profile', 'email'])
    .then((res: FacebookLoginResponse)=>{
      console.log('response',res);
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
      component: PopoverComponent,
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

}
