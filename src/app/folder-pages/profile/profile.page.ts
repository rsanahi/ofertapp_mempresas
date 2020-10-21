import { Component, OnInit, NgZone } from '@angular/core';
import { ProfileService } from '../../services/plugins/profile.service';
import { BusinessService } from '../../services/plugins/business.service';
import { FilesService } from '../../services/ui/files.service';
import { API } from '../../config/api-constants';
import { LoadingService } from '../../services/ui/loading.service';
import { ToastService } from '../../services/ui/toast.service';
import { SheetService } from '../../services/ui/sheet.service';
import { TranslateService } from '@ngx-translate/core';
import { EventsService } from '../../services/events.service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  //FORM
  profileForm: FormGroup;
  imgProfile;
  subs: Boolean = true;
  proenv: any;

  validation_messages = {
    'name': [
      { type: 'required', message: 'signup.errors_form.name' }
    ],
    'name_business': [
      { type: 'required', message: 'signup.errors_form.name_business' }
    ],
    'email': [
      { type: 'required', message: 'signup.errors_form.email1' },
      { type: 'pattern', message: 'signup.errors_form.email2' }
    ],
    'direccion':[
      { type: 'required', message: 'signup.errors_form.address'},
      { type: 'minlength', message: 'signup.errors_form.password2' },
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

  categories = [];
  camera_text = "";
  gallery_text = "";
  cancel_text = "";
  image_source_text = "";

  loading_profile = "";

  constructor(
    private profileService: ProfileService,
    private fb: FormBuilder,
    private businessService: BusinessService,
    private loadingService: LoadingService,
    private actionsheetService: SheetService,
    private translate: TranslateService,
    private fileService: FilesService,
    private eventService: EventsService,
    private zone: NgZone,
    private toastService: ToastService,
  ) {
    this.get_categories();
    this.get_user_details();
    this.create_profile_form();

    if(this.subs){
      this.subs = false;
      this.proenv = this.eventService.getImgBusinessProfile().subscribe((res)=>{
        if(res != ''){
          this.update_image(res);
        }
      });
    }

   }

  ngOnInit() {
  }

  create_profile_form(){
    this.profileForm = this.fb.group({
      nombre_empresa: new FormControl('', Validators.required),
      direccion: new FormControl('', Validators.compose([Validators.required, Validators.minLength(15)])),
      phone: new FormControl('', Validators.compose([Validators.required])),
      name: new FormControl('', Validators.required),
      categoria: new FormControl('', Validators.required),
      email: new FormControl({value: '', disabled: true}, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])),
    });
  }

  get_user_details(){
    this.profileService.get_details('get_business').subscribe((res:any)=>{
      if(res){
        this.profileForm.patchValue({
          'nombre_empresa':res.nombre_local,
          'direccion': res.direccion,
          'phone': res.telefono,
          'categoria': res.categoria,
          'name':res.fk_user.first_name,
          'email': res.fk_user.email,
        });
        this.imgProfile = this.get_api_url()+res.logo;
      }
    },
    (error: any)=>{
      // console.log("error",error);
    });
  }

  get_categories(){
    this.businessService.get_business_categories().subscribe((res:any)=>{
      if(res){
        this.categories = res.categorias;
      }
    },
    (error: any)=>{
      // console.log("error",error);
    });
  }

  update_user_profile(){
    let postData = {};
    let valid = false;
    if(this.profileForm.valid){
      postData = {
        nombre_local: this.profileForm.value.nombre_empresa,
        telefono: this.profileForm.value.phone,
        direccion: this.profileForm.value.direccion,
        categoria: this.profileForm.value.categoria,
        fk_user: {
          first_name: this.profileForm.value.name,
          email: this.profileForm.value.email,
        }
      }
      valid = this.profileForm.valid
    }
    if(valid){
      let url = 'update_business';
      this.translate.get('profile.loading_profile').subscribe(
        value => {
          this.loading_profile = value;
        }
      )

      this.loadingService.loading_present(this.loading_profile);
      this.profileService.update_details(url, postData).subscribe((res:any)=>{
        this.toastService.presentToast("Se ha actualizado correctamente ..");
        this.loadingService.loading_dismiss();
      },
      (error: any)=>{
        this.toastService.presentToast("Network connection error.");
        this.loadingService.loading_dismiss();
      });
    }
  }

  //Load Img
  update_image(img){
    this.translate.get('profile.loading_img_profile').subscribe(
      value => {
        this.loading_profile = value;
      }
    )
    this.loadingService.loading_present(this.loading_profile);
    this.profileService.update_img_profile('update_img_profile', img).subscribe((res:any)=>{
      if(res){
        this.zone.run(()=>{this.imgProfile = this.get_api_url()+res.detail.logo;});
      }
      this.loadingService.loading_dismiss();
    },
    (error:any)=>{
      this.toastService.presentToast("Network connection error.");
      this.loadingService.loading_dismiss();
    });
  }

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
        // console.log('Cancel clicked');
      }
    }];
    this.actionsheetService.generate_sheet(this.image_source_text, data);
  }

  get_api_url(){
    let url = environment.apiURL.slice(0,environment.apiURL.lastIndexOf('/'));
    return url;
  }

  ionViewDidLeave(){
    this.subs = true;
    this.proenv.unsubscribe();
  }

}
