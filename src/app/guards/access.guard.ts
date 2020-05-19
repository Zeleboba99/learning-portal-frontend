import {Inject, Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {AuthService} from '../services/auth.service';

@Injectable()
export class AccessGuard implements CanActivate {

  constructor(@Inject(AuthService) private authService: AuthService, private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.userLoggedIn.getValue() !== null) {
      return true;
    } else {
      this.router.navigate(['/sign-in']);
      return false;
    }
  }
}
