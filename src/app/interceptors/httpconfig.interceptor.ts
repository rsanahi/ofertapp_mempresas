import { Injectable } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { AuthConstants } from '../config/auth-constants';
import { BusinessService } from '../services/plugins/business.service';

import { 
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
 } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor{
    token = "";
    constructor(
        private storageService: StorageService,
        private businessService: BusinessService,
    ){}
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let res = this.businessService.get_token();
        if(res){
            this.token = "Token "+res;
        }
        else {
            this.token = "";
        }

        if(this.token != '' && this.token != null){
            request = request.clone({ headers: request.headers.set('Authorization', this.token) });
           
        }

        // if(!request.headers.has('Content-Type')){
        //     request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        // }

        request = request.clone({ headers: request.headers.set('Accept', '*/*') });
    
        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    //console.log('event--->>>', event);
                }
                return event;
            }));
    }
}