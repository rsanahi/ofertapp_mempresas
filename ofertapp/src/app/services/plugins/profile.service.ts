import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { AuthConstants } from '../../config/auth-constants';
import { Observable } from 'rxjs';
import { API } from '../../config/api-constants';


@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private httpService: HttpService,
  ) { }

  get_details(url:string): Observable<any> {
    return this.httpService.get(API[url]);
  }

  update_details(url:string, data:any): Observable<any> {
    return this.httpService.put(API[url], data);
  }
}
