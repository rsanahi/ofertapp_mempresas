import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';
import { AuthConstants } from '../config/auth-constants';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;

  // variables
  proximamente: String;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    private translate: TranslateService,
    public toastController: ToastController,
    ) { 
    this.createForm();
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
  }

  //ion popover
  open_popover(ev){
    
  }

  useLanguage(language: string) {
    this.translate.use(language);
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
