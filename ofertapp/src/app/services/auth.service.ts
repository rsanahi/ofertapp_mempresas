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
    this.storageService.remove(AuthConstants.AUTH).then(res=>{
      this.router.navigate(['']);
    })
  }
}
