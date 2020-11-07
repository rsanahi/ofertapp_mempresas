import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthConstants } from '../config/auth-constants';
import { API } from '../config/api-constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private httpService: HttpService,
    private storageService: StorageService,
    private router: Router
  ) { }

  login(postData:any,url:string): Observable<any> {
    return this.httpService.post(API[url], postData);
  }

  signup(postData:any,url:string): Observable<any>{
    return this.httpService.post(API[url], postData);
  }

  logout(){
    return this.httpService.post(API['logout']);
  }

  facebook(data){
    const body = {
      provider:'facebook',
      code: data
    };

    return this.httpService.post('/api/login/social/token_user/facebook/', body);
  }

  cambiar_contraseña(data){
    return this.httpService.post('api/auth/users/set_password/', data);
  }
}
