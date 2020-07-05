import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { IonSlides} from '@ionic/angular';
import { SingupConstants } from '../config/singup-constants';
import { NONE_TYPE } from '@angular/compiler';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  swiper:any;
  @ViewChild('mySlider')  slides: IonSlides;
  slidesOptions = { initialSlide: 0 }

  //Variables
  user_type = Boolean; //Si es True sera Cliente, False Empresa

  format_user_form = SingupConstants.CLIENTE;

  constructor() { }

  ngOnInit() {
  }

  set_user_type(type){
    /*
    Funcion para definir el tipo de usuario a crear 

    @type: Boolean
      - True: Usuario Cliente
      - False: Usuario Empresa
    */
    this.user_type = type;
    this.type_form();
    this.swipeNext();
  }

  type_form(){
    /*
    Funcion para definir las variables del formulario del acuerdo al tipo 
    de usuario seleccionado
    */
    if(this.user_type){
      this.format_user_form = SingupConstants.CLIENTE;
      return true;
    }
    else{
      this.format_user_form = SingupConstants.EMPRESA;
      return false;
    }
  }




  // Slider block and moves events

  onIonDrag(event){
    this.swiper = event;
    this.slides.lockSwipes(true);
  }

  swipeNext(){
    if(this.swiper){
      this.slides.lockSwipes(false);
    }
    this.slides.slideNext();
    this.slides.lockSwipes(true);
  }

  swipeBefore(){
    if(this.swiper){
      this.slides.lockSwipes(false);
    }
    this.slides.slidePrev();
    this.slides.lockSwipes(true);
  }

}
