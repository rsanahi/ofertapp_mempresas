import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { StorageService } from '../services/storage.service';
import { AuthConstants } from '../config/auth-constants';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
  ) { }

  post(serviceName: string, data: any = []){
    const options = { headers: this.headers, withCredentials: false};
    const url = environment.apiURL+serviceName;
    return this.http.post(url, data, options);
  }

  get(serviceName: string, data:any={}){
    const options = { headers: this.headers, withCredentials: false, params: data};
    const url = environment.apiURL+serviceName;
    return this.http.get(url, options);
  }

  put(serviceName: string, data: any){
    const options = { headers: this.headers, withCredentials: false};
    const url = environment.apiURL+serviceName;
    return this.http.put(url, data, options);
  }

  delete(serviceName: string){
    const url = environment.apiURL+serviceName;
    return this.http.delete(url);
  }

  put_form(serviceName: string, data: any){
    let headers = new HttpHeaders({

    });
    const options = { headers: headers, withCredentials: false};
    const url = environment.apiURL+serviceName;
    return this.http.put(url, data, options);
  }

  post_form(serviceName: string, data: any){
    let headers = new HttpHeaders({

    });
    const options = { headers: headers, withCredentials: false};
    const url = environment.apiURL+serviceName;
    return this.http.post(url, data, options);
  }

}
