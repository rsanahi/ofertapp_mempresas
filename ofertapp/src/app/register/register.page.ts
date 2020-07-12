import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { IonSlides} from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from '../components/popover/popover.component';
import { PasswordValidator } from '../validators/password.validator';

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
  ) {
    this.create_client_form()
    this.create_business_form()
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
    if(this.user_type){
      if(this.clientForm.valid){
        postData = this.clientForm.value;
        valid = this.clientForm.valid;
      }
    }
    else{
      if(this.businessForm.valid){
        postData = this.businessForm.value
        valid = this.businessForm.valid;
      }
    }
    console.log(valid);
    console.log(postData);
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

}
