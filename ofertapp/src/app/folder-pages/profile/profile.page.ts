import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/plugins/profile.service';
import { API } from '../../config/api-constants';
import { LoadingController } from '@ionic/angular';
import { ToastService } from '../../services/ui/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  //FORM
  profileForm: FormGroup;

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

  constructor(
    private profileService: ProfileService,
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private toastService: ToastService,
    private translate: TranslateService
  ) {
    this.get_user_details();
    this.create_profile_form();
   }

  ngOnInit() {
  }

  create_profile_form(){
    this.profileForm = this.fb.group({
      nombre_empresa: new FormControl('', Validators.required),
      direccion: new FormControl('', Validators.compose([Validators.required, Validators.minLength(15)])),
      phone: new FormControl('', Validators.compose([Validators.required])),
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])),
    });
  }

  get_user_details(){
    this.profileService.get_details('get_business').subscribe((res:any)=>{

      if(res){
        console.log("response",res)
      }
      else {
        console.log('Incorrect username or password');
      }
    },
    (error: any)=>{
      console.log("error",error);
    });
  }

  update_user_profile(){
    let postData = {};
    let valid = false;
    console.log(this.profileForm.errors);
    if(this.profileForm.valid){
      console.log("valid");
      postData = {
        nombre_local: this.profileForm.value.nombre_empresa,
        telefono: this.profileForm.value.phone,
        direccion: this.profileForm.value.direccion,
        fk_user: {
          first_name: this.profileForm.value.name,
          email: this.profileForm.value.email,
        }
      }
      valid = this.profileForm.valid
    }
    console.log("updating");
    if(valid){
      let url = 'update_business';
      this.profileService.update_details(url, postData).subscribe((res:any)=>{
        if(res){
          console.log("response",res)
        }
        else {
          console.log('Incorrect username or password');
        }
      },
      (error: any)=>{
        console.log("error",error);
      });
    }
  }

}
