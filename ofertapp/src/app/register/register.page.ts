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
  left_arrow : Boolean;
  rigth_arrow : Boolean;
  user_type : Boolean; //Si es True sera Cliente, False Empresa

  //FORM TEXT
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
