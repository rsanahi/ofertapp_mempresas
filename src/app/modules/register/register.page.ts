import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { IonSlides} from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from '../../components/popover/popover.component';
import { PasswordValidator } from '../../validators/password.validator';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ToastService } from '../../services/ui/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  swiper:any;
  @ViewChild('mySlider')  slides: IonSlides;
  slidesOptions = { 
    initialSlide: 0,

    centeredSlides: true,
    pagination: {
      el: '.swiper-pagination',
      type: 'custom',
    },
   }

  //Variables
  left_arrow : Boolean;
  rigth_arrow : Boolean;
  user_type : Boolean; //Si es True sera Cliente, False Empresa
  isLoading = false;
  lenguaje: String = "";

  //FORM
  clientForm: FormGroup;
  businessForm: FormGroup;

  validation_messages = {
    'name': [
      { type: 'required', message: 'signup.errors_form.name' }
    ],
    'email': [
      { type: 'required', message: 'signup.errors_form.email1' },
      { type: 'pattern', message: 'signup.errors_form.email2' }
    ],
    'phone': [
      { type: 'required', message: 'signup.errors_form.phone' },
    ],
    'password': [
      { type: 'required', message: 'signup.errors_form.password1' },
      { type: 'minlength', message: 'signup.errors_form.password2' },
      { type: 'pattern', message: 'signup.errors_form.password3' }
    ],
    'confirm_password': [
      { type: 'required', message: 'signup.errors_form.confirm_password' }
    ],
    'matching_passwords': [
      { type: 'areEqual', message: 'signup.errors_form.matching_passwords' }
    ],
  };

  constructor(
    public popoverController: PopoverController,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private toastService: ToastService,
    private translate: TranslateService,
    private eventService: EventsService,
  ) {
    this.create_client_form();
    this.create_business_form();

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

  create_client_form(){
    this.clientForm = this.fb.group({
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])),
      matching_passwords : new FormGroup({
        password: new FormControl('', Validators.compose([
          Validators.minLength(8),
          Validators.required,
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
        ])),
        confirm_password: new FormControl('', Validators.required)
      }, (formGroup: FormGroup) => {
        return PasswordValidator.areEqual(formGroup);
      })
    });
  }

  create_business_form(){
    this.businessForm = this.fb.group({
      name: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])),
      matching_passwords: new FormGroup({
        password: new FormControl('', Validators.compose([
          Validators.minLength(8),
          Validators.required,
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
        ])),
        confirm_password: new FormControl('', Validators.required)
      }, (formGroup: FormGroup) => {
        return PasswordValidator.areEqual(formGroup);
      })
    })
  }

  register(){
    let postData = {};
    let valid;
    let url;
    if(this.user_type){
      if(this.clientForm.valid){
        postData = {
          'fk_user':{
            'first_name':this.clientForm.value.name,
            'email':this.clientForm.value.email,
            'password':this.clientForm.value.matching_passwords.password
          }
        };
        valid = this.clientForm.valid;
        url = 'register_client';
      }
    }
    else{
      if(this.businessForm.valid){
        postData = {
          'telefono':this.businessForm.value.phone,
          'fk_user':{
            'first_name':this.businessForm.value.name,
            'email':this.businessForm.value.email,
            'password':this.businessForm.value.matching_passwords.password
          }
        };
        valid = this.businessForm.valid;
        url = 'register_business';
      }
    }
    if(valid){
      this.loading_present();
      this.authService.login(postData,url).subscribe((res:any)=>{
        this.loading_dismiss();
        if(res.fk_user){
          this.router.navigate(['/login'])
        }
        else {
          console.log('Incorrect username or password');
        } 
      },
      (error: any)=>{
        let current_error = error.error;
        let message = "";
        this.swipeBefore();
        if(current_error.fk_user.username){
          this.translate.get('signup.errors_backend.already_email').subscribe(
            value => {
              message = value;
            }
          )
        }
        if(current_error.fk_user.password){
          let errors = current_error.fk_user.password;
          errors.forEach(element => {
            if(element=='This password is too common.'){
              this.translate.get('signup.errors_backend.password_common').subscribe(
                value => {
                  message = value;
                }
              )
            }
            else if(element=='The password is too similar to the first name.'){
              this.translate.get('signup.errors_backend.password_similar').subscribe(
                value => {
                  message = value;
                }
              )
            }
          });
        }
        this.toastService.presentToast(message);
        this.loading_dismiss();
      });
    }
  }

  set_user_type(type){
    /*
    Funcion para definir el tipo de usuario a crear 

    @type: Boolean
      - True: Usuario Cliente
      - False: Usuario Empresa
    */
    this.user_type = type;
    this.clientForm.reset();
    this.businessForm.reset();
    this.swipeNext();
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

  // Slider block and moves events

  onIonDrag(event){
    this.swiper = event;
    this.slides.lockSwipes(true);
  }

  swipeNext(){
    this.slides.lockSwipes(false);
    this.slides.slideNext().then(()=>{
      this.slides.lockSwipes(true);
      this.set_arrows();
    });
  }

  swipeBefore(){
    this.slides.lockSwipes(false);
    this.slides.slidePrev().then(()=>{
      this.slides.lockSwipes(true);
      this.set_arrows();
    });
  }

  set_arrows(){
    this.slides.getActiveIndex().then((index)=>{
      if(index == 0){
        this.left_arrow = false;
        this.rigth_arrow = false;
      }
      else if (index == 3){
        this.left_arrow = true;
        this.rigth_arrow = false;
      }
      else{
        this.left_arrow = true;
        this.rigth_arrow = true;
      }
    });
  }

  //loading
  async loading_present() {
    this.isLoading = true;
    return await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss();
        }
      });
    });
  }

  async loading_dismiss() {
    if (this.isLoading) {
      this.isLoading = false;
      return await this.loadingController.dismiss();
    }
    return null;
  }

}
