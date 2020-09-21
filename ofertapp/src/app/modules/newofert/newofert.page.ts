import { Component, OnInit, ViewChild, Input, Output, EventEmitter, NgZone} from '@angular/core';
import { OfferService } from '../../services/plugins/offer.service';
import { FilesService } from '../../services/ui/files.service';
import { API } from '../../config/api-constants';
import { LoadingService } from '../../services/ui/loading.service';
import { ToastService } from '../../services/ui/toast.service';
import { SheetService } from '../../services/ui/sheet.service';
import { EventsService } from '../../services/events.service';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-newofert',
  templateUrl: './newofert.page.html',
  styleUrls: ['./newofert.page.scss'],
})
export class NewofertPage implements OnInit {

  camera_text = "";
  gallery_text = "";
  cancel_text = "";
  image_source_text = "";
  ofertaForm: FormGroup;

  subs: Boolean = true;
  proenv: any;

  //foto form
  img_form;
  img_src="assets/media/oferta_default.png";

  //price
  BACKSPACE_INPUT_TYPE = 'deleteContentBackward';
  BACKSPACE_KEY = 'Backspace';
  amount: string = '';
  amountFormated: string = "";
  precision: number = 2;

  @ViewChild('dummyFacade', {static: false}) private dummyFacade: IonInput;

  validation_messages = {
    'titulo': [
      { type: 'required', message: 'new_ofert.error_forms.title' }
    ],
    'descripcion': [
      { type: 'required', message: 'new_ofert.error_forms.description' }
    ],
    'precio':[
      { type: 'required', message: 'new_ofert.error_forms.price'},
    ],
    'moneda': [
      { type: 'required', message: 'new_ofert.error_forms.coin' },
    ],
    'porcentaje': [
      { type: 'required', message: 'new_ofert.error_forms.percent' },
    ],
    'cantidad': [
      { type: 'required', message: 'new_ofert.error_forms.quantity' },
    ],
  };

  constructor(
    private loadingService: LoadingService,
    private actionsheetService: SheetService,
    private translate: TranslateService,
    private fileService: FilesService,
    private eventService: EventsService,
    private fb: FormBuilder,
    private offerService: OfferService,
    private zone: NgZone,
  ) { 
    if(this.subs){
      this.subs = false;
      this.proenv = this.eventService.getImgBusinessProfile().subscribe((res)=>{
        if(res != ''){
          this.img_form = res;
          this.zone.run(()=>{this.img_src = res.get('logo_src');});
          
          console.log(this.img_src);
        }
      });
    }

    this.create_ofert_form();
  }

  ngOnInit() {
  }

  create_ofert_form(){
    this.ofertaForm = this.fb.group({
      titulo: new FormControl('', Validators.required),
      descripcion: new FormControl('Ionic enables developers to build performant, high-quality mobile apps.', Validators.compose([Validators.required, Validators.maxLength(200)])),
      precio: new FormControl('', Validators.compose([Validators.required])),
      moneda: new FormControl('1', Validators.required),
      porcentaje: new FormControl('', Validators.required),
      cantidad: new FormControl('1', Validators.compose([Validators.required])),
    });
  }

  set_oferta(){
    let valid = false;
    let formData = new FormData();
    if(this.img_form != null || this.img_form != ''){
      formData = this.img_form;
    }
    if(this.ofertaForm.valid){
      
      formData.append('titulo', this.ofertaForm.value.titulo);
      formData.append('descripcion', this.ofertaForm.value.descripcion);
      formData.append('precio', this.amount);
      formData.append('moneda', this.ofertaForm.value.moneda);
      formData.append('porcentaje', this.ofertaForm.value.porcentaje);
      formData.append('cantidad', this.ofertaForm.value.cantidad);
      valid = this.ofertaForm.valid;
    }
    if(valid){
      this.loadingService.loading_present();
      this.offerService.set_new_offer('set_ofert',formData).subscribe((res:any)=>{
        console.log(res);
      },
      (error: any)=>{
        console.log(error);
      },
      ()=>{
        this.loadingService.loading_dismiss();
      });
    }
  }

  // img
  selectImage(){

    this.translate.get('profile.camera_source').subscribe(
      value => {
        this.camera_text = value;
      }
    )

    this.translate.get('profile.library_source').subscribe(
      value => {
        this.gallery_text = value;
      }
    )

    this.translate.get('profile.cancel_load').subscribe(
      value => {
        this.cancel_text = value;
      }
    )

    this.translate.get('profile.image_source').subscribe(
      value => {
        this.image_source_text = value;
      }
    )

    let data = [{
      text: this.camera_text,
      role: 'destructive',
      icon: 'camera',
      handler: () => {
        this.fileService.take_picture("camera");
      }
    }, {
      text: this.gallery_text,
      icon: 'image',
      handler: () => {
        this.fileService.take_picture("gallery");
      }
    }, {
      text: this.cancel_text,
      icon: 'close',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    }];
    this.actionsheetService.generate_sheet(this.image_source_text, data);
  }

  //price format
  handleInput(event: CustomEvent) {
    this.clearInput();
    // check if digit
    if (event.detail.data && !isNaN(event.detail.data)) {
      this.addDigit(event.detail.data);
    } else if (event.detail.inputType === this.BACKSPACE_INPUT_TYPE) {
      // this handles numpad input for delete/backspace
      this.delDigit();
    }
  } 

  private addDigit(key: string) {
    this.amount = this.amount + key;
    this.formattPrice();
  }

  private delDigit() {
    this.amount = this.amount.substring(0, this.amount.length - 1);
    this.formattPrice();
  }

  private formattPrice(){
    if(this.amount.length > 0){
      this.amountFormated = this.amount + ' $';
    }
    else{
      this.amountFormated = '';
    }
    this.set_input();
  }

  private clearInput() {
    this.dummyFacade.value = ''; // ensures work for mobile devices
    // ensures work for browser
    this.dummyFacade.getInputElement().then((native: HTMLInputElement) => {
      native.value = '';
    });
  }

  private set_input(){
    this.dummyFacade.value = this.amountFormated; // ensures work for mobile devices
    this.dummyFacade.getInputElement().then((native: HTMLInputElement) => {
      native.value = this.amountFormated;
    });
  }

  ionViewDidLeave(){
    this.subs = true;
    this.proenv.unsubscribe();
  }
}
