import { Component, OnInit, ViewChild, NgZone} from '@angular/core';
import { OfferService } from '../../services/plugin/offer.service';
import { FilesService } from '../../services/ui/files.service';
import { LoadingService } from '../../services/ui/loading.service';
import { ToastService } from '../../services/ui/toast.service';
import { SheetService } from '../../services/ui/sheet.service';
import { EventsService } from '../../services/events.service';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IonInput } from '@ionic/angular';
import { AlertService } from '../../services/ui/alert.service';

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
  data_edit: {
    cantidad: 0,
    descripcion: "",
    moneda: null,
    porcentaje: null,
    precio: null,
    titulo: null,
    img: "",
  }

  data_copy: any;

  subs: Boolean = true;
  proenv: any = null;

  //foto form
  img_form:any = '';
  img_src="assets/media/oferta_default.png";

  //price
  BACKSPACE_INPUT_TYPE = 'deleteContentBackward';
  BACKSPACE_KEY = 'Backspace';
  amount: string = '';
  amountFormated: string = "";
  precision: number = 2;

  loading_ofer = "";
  sucess_offer = "";
  deleting_offer = "";
  sucess_delete = "";
  enable_offert = ""; 
  sucess_enable = ""; 
  updating_offer = "";
  updating_success = "";
  delete_confirm = "";

  //edit oferta
  edit:Boolean = false;
  checked_offert = true;
  id_offert = null;
  button_save_edit = false;

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
    private toastService: ToastService,
    private router: Router,
    private activaedRoute: ActivatedRoute,
    private alertService: AlertService,
  ) { 
    this.activaedRoute.queryParams.subscribe( _ => {
      
      if(this.router.getCurrentNavigation().extras.state){
        this.edit = this.router.getCurrentNavigation().extras.state.edit;
        this.data_edit = this.router.getCurrentNavigation().extras.state.offer;

        //this.data_copy = this.data_edit;

        this.checked_offert = this.router.getCurrentNavigation().extras.state.offer.deshabilitado;
        this.id_offert = this.router.getCurrentNavigation().extras.state.offer.id;
        this.set_edit_data_form();
      }
    })
    if(this.subs){
      this.subs = false;
      this.proenv = this.eventService.getImgOfert().subscribe((res)=>{
        if(res != ''){
          this.img_form = res;
          this.button_save_edit = true;
          this.zone.run(()=>{this.img_src = res.get('logo_src');});
        }
      });
    }
    this.ac();
    this.create_ofert_form();
  }

  ngOnInit() {
  }
  ac(){
    this.subs = true;
    this.translate.get('new_ofert.loading_ofert').subscribe(
      value => {
        this.loading_ofer = value;
      }
    )

    this.translate.get('new_ofert.sucess').subscribe(
      value => {
        this.sucess_offer = value;
      }
    )

    this.translate.get('new_ofert.deleting_ofert').subscribe(
      value => {
        this.deleting_offer = value;
      }
    )

    this.translate.get('new_ofert.sucess_delete').subscribe(
      value => {
        this.sucess_delete = value;
      }
    )

    this.translate.get('new_ofert.updating_ofert').subscribe(
      value => {
        this.updating_offer = value;
      }
    )

    this.translate.get('new_ofert.updating_sucess').subscribe(
      value => {
        this.updating_success = value;
      }
    )
    this.translate.get('new_ofert.delete_confirm').subscribe(
      value => {
        this.delete_confirm = value;
      }
    )
  }

  enable_save(){
    if(this.edit){
      if(this.data_copy.cantidad != this.ofertaForm.value.cantidad ||
         this.data_copy.descripcion != this.ofertaForm.value.descripcion ||
         this.data_copy.moneda != this.ofertaForm.value.moneda ||
         this.data_copy.porcentaje != this.ofertaForm.value.porcentaje ||
         this.data_copy.precio != this.ofertaForm.value.precio ||
         this.data_copy.titulo != this.ofertaForm.value.titulo){

          this.button_save_edit = true;
      }
      else{
        this.button_save_edit = false;
      }
    }
  }

  set_edit_data_form(){
    this.ofertaForm.patchValue({
      'titulo':this.data_edit.titulo,
      'descripcion': this.data_edit.descripcion,
      'precio': this.data_edit.precio,
      'moneda': String(this.data_edit.moneda),
      'porcentaje':this.data_edit.porcentaje,
      'cantidad': this.data_edit.cantidad,
    });

    this.data_copy = {
      titulo: this.data_edit.titulo,
      descripcion: this.data_edit.descripcion,
      precio: this.data_edit.precio,
      moneda: String(this.data_edit.moneda),
      porcentaje: this.data_edit.porcentaje,
      cantidad: this.data_edit.cantidad
    }

    this.img_src = this.data_edit.img;
    this.amount = this.data_edit.precio;
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
    if(this.img_form != null && this.img_form != ''){
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

      this.loadingService.loading_present(this.loading_ofer);
      this.offerService.set_new_offer('set_ofert',formData).subscribe((res:any)=>{
        this.loadingService.loading_dismiss();
        this.toastService.presentToast(this.sucess_offer,'success');
        this.eventService.set_ofert_request(true);
        this.router.navigate(['/main']);
      },
      (error: any)=>{
        this.loadingService.loading_dismiss();
      });
    }
  }

  update_oferta(){
    let valid = false;
    let formData = new FormData();
    if(this.img_form != null && this.img_form != ''){
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
      this.loadingService.loading_present(this.updating_offer);
      this.offerService.update_ofert('set_ofert',formData, this.id_offert).subscribe((res:any)=>{
        this.loadingService.loading_dismiss();
        this.toastService.presentToast(this.updating_success,'success');
        this.eventService.set_ofert_request(true);
        this.router.navigate(['/main']);
      },
      (error: any)=>{
        this.toastService.presentToast(error.message,'danger');
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
        this.fileService.take_picture("camera", true);
      }
    }, {
      text: this.gallery_text,
      icon: 'image',
      handler: () => {
        this.fileService.take_picture("gallery", true);
      }
    }, {
      text: this.cancel_text,
      icon: 'close',
      role: 'cancel',
      handler: () => {
      }
    }];
    this.actionsheetService.generate_sheet(this.image_source_text, data);
  }

  habilitar_oferta(){
    this.checked_offert =  !this.checked_offert;
    if(this.checked_offert){
      this.translate.get('new_ofert.enable_offert').subscribe(
        value => {
          this.enable_offert = value; 
        }
      )
      this.translate.get('new_ofert.sucess_enable').subscribe(
        value => {
          this.sucess_enable = value;  
        }
      )
    }
    else {
      this.translate.get('new_ofert.disable_offert').subscribe(
        value => {
          this.enable_offert = value; 
        }
      )
      this.translate.get('new_ofert.sucess_disable').subscribe(
        value => {
          this.sucess_enable = value;  
        }
      )
    }
    let data = {
      titulo: this.data_copy.titulo,
      id: this.id_offert,
      deshabilitado: this.checked_offert,
    }
    this.loadingService.loading_present(this.enable_offert);
    this.offerService.update_ofert('set_ofert', data, this.id_offert).subscribe((res:any)=>{
      this.toastService.presentToast(this.sucess_enable,'success');
      this.loadingService.loading_dismiss();
    },
    (error: any)=>{
      this.toastService.presentToast(error.message.detail,'danger');
      this.loadingService.loading_dismiss();
    });
  }

  // 
  eliminar_oferta(){
    let buttons = {
      cssClass: 'my-custom-class',
      message: `<strong>${this.delete_confirm}</strong>`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.confirm_eliminar_oferta();
          }
        }
      ]
    }
    this.alertService.presentAlertConfirm(buttons);

  }

  confirm_eliminar_oferta(){
    this.loadingService.loading_present(this.deleting_offer);
    this.offerService.delete_ofert('set_ofert', this.id_offert).subscribe((res:any)=>{
      this.router.navigate(['/main']);
      this.toastService.presentToast(this.sucess_delete, 'success');
      this.loadingService.loading_dismiss();
    },
    (error: any)=>{
      this.toastService.presentToast(error.message.detail);
      this.loadingService.loading_dismiss();
    });
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
      this.amountFormated = this.amount;
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
    if(this.proenv != null){
      this.proenv.unsubscribe();
    }
    this.img_form = '';
    this.edit = false;
    this.checked_offert = true;
    this.id_offert = null;
    this.button_save_edit = false;
    this.img_src="assets/media/oferta_default.png";
    this.eventService.clear_oferta_img();
  }
}
