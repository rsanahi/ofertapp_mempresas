import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { IonSlides} from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from '../components/popover/popover.component';

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
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      password2: ['', Validators.required],
    });
  }

  create_business_form(){
    this.businessForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      password2: ['', Validators.required]
    })
  }

  register(){
    if(this.user_type){
      console.log(this.clientForm.value);
    }
    else{
      console.log(this.businessForm.value);
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
