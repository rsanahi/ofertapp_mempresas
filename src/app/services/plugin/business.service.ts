import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { AuthConstants } from '../../config/auth-constants';
import { Observable } from 'rxjs';
import { API } from '../../config/api-constants';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  user_details = {};
  token = null;
  user_group = {};

  constructor(
    private httpService: HttpService,
    private storageService: StorageService,
  ) { }

  get_business_categories(): Observable<any> {
    return this.httpService.get(API['categories']);
  }

  is_authenticated(){
    if(this.token != null){
      return true;
    }
    else{
      return false;
    }
  }

  set_token(token){
    this.token = token;
  }

  get_user_details(){
    return {
      user_group: this.user_group,
      user_details: this.user_details,
    }
  }

  set_user_details(user){
    this.user_group = {
      id: user.groups[0].id,
      name: user.groups[0].name,
    }

    this.user_details = {
      username: user.username,
    }

    this.storageService.store('user_details', {
      user_group: this.user_group,
      user_details: this.user_details
    });
  }

  get_token() {
    if(this.token == null){
      this.storageService.get(AuthConstants.AUTH).then( res => {
        if(res){
            this.token = res;
        }
        else {
          this.token = ""; 
        }
      }).catch( err => {
          // console.log(err);
      });
      return this.token;
    }
    else{
      return this.token;
    }
  }

  clear_user_details(){
    this.user_details = null;
    this.token = null;
    this.user_group = null;
    this.storageService.clear();
  }
  
}
