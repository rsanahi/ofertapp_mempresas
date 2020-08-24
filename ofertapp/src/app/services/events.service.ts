import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private current_lenguaje = new BehaviorSubject('es');
  private current_image = new BehaviorSubject('');

  constructor() { }

  change_current_lenguaje(data: any) {
    const new_languaje = data;
    this.current_lenguaje.next(new_languaje);
  }

  change_business_img_profile(data) {
    const new_img_profile = data;
    this.current_image.next(new_img_profile);
  }

  getLenguajeObservable(): Observable<String> {
    return this.current_lenguaje.asObservable();
  }

  getImgBusinessProfile(): Observable<any> {
    return this.current_image.asObservable();
  }

}
