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

  get_oferts(url:string, data:any=[]): Observable<any> {
    return this.httpService.get(API[url], data);
  }

  delete_ofert(url:string, data:any=[]): Observable<any> {
    url = API[url]+`${data}/`;
    return this.httpService.delete(url);
  }

  update_ofert(url:string, data:any=[], id): Observable<any> {
    url = API[url]+`${id}/`;
    return this.httpService.put_form(url, data);
  }

  get_count_categories(url:string, data:any=[]): Observable<any> {
    url = API[url]+'oferts-categories/';
    return this.httpService.get(url, data);
  }

}
