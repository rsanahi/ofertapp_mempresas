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

  });

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
  ) { }

  post(serviceName: string, data: any){
    const options = { header: this.headers, withCredentials: false};
    const url = environment.apiURL+serviceName;
    return this.http.post(url, data, options);
  }

  get(serviceName: string){
    const options = { header: this.headers, withCredentials: false};
    const url = environment.apiURL+serviceName;
    return this.http.get(url, options);
  }

  put(serviceName: string, data: any){
    const options = { header: this.headers, withCredentials: false};
    const url = environment.apiURL+serviceName;
    return this.http.put(url, data, options);
  }

}
