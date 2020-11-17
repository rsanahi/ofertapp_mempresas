import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { BusinessService } from './plugin/business.service';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private current_lenguaje = new BehaviorSubject('es');
  private current_image = new BehaviorSubject('');
  private current_user = new BehaviorSubject({});
  private img_oferta = new BehaviorSubject('');

  //created or updated oferta
  private request_ofert = new BehaviorSubject(false);

  constructor(
    private businessService: BusinessService
  ) { }

  change_current_lenguaje(data: any) {
    const new_languaje = data;
    this.current_lenguaje.next(new_languaje);
  }

  change_business_img_profile(data) {
    const new_img_profile = data;
    this.current_image.next(new_img_profile);
  }

  change_oferta_img(data) {
    const new_img_oferta = data;
    this.img_oferta.next(new_img_oferta);
  }

  set_user_logeed() {
    const user_data = this.businessService.get_user_details();
    this.current_user.next(user_data);
  }

  set_ofert_request(data){
    this.request_ofert.next(data);
  }

  getLenguajeObservable(): Observable<String> {
    return this.current_lenguaje.asObservable();
  }

  getImgBusinessProfile(): Observable<any> {
    return this.current_image.asObservable();
  }

  getImgOfert(): Observable<any> {
    return this.img_oferta.asObservable();
  }

  getUserLogged(): Observable<any> {
    return this.current_user.asObservable();
  }

  getResquestOfert(): Observable<any> {
    return this.request_ofert.asObservable();
  }

  clear_business_img_profile(){
    this.current_image = new BehaviorSubject('');
  }

  clear_oferta_img(){
    this.img_oferta = new BehaviorSubject('');
  }

  clear_request_ofert(){
    this.request_ofert = new BehaviorSubject(false);
  }

}
