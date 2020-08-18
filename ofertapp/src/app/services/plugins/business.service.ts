import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { AuthConstants } from '../../config/auth-constants';
import { Observable } from 'rxjs';
import { API } from '../../config/api-constants';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  constructor(
    private httpService: HttpService,
  ) { }

  get_business_categories(): Observable<any> {
    return this.httpService.get(API['categories']);
  }
}
