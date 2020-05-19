import {Injectable} from '@angular/core';
import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {CookieService} from 'angular2-cookie/core';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  constructor(private cookieService: CookieService) {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (this.cookieService.get(environment.ACCESS_TOKEN)) {
      req = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + this.cookieService.get(environment.ACCESS_TOKEN)
        }
      });
    }
    return next.handle(req);
  }
}
