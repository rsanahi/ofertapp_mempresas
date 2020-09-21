import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { AuthConstants } from '../../config/auth-constants';
import { Observable } from 'rxjs';
import { API } from '../../config/api-constants';

@Injectable({
  providedIn: 'root'
})
export class OfferService {

  constructor(
    private httpService: HttpService,
  ) { }

  set_new_offer(url:string, data:any): Observable<any> {
    return this.httpService.post_form(API[url], data);
  }

  get_details(url:string): Observable<any> {
    return this.httpService.get(API[url]);
  }

}
