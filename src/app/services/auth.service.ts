import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {User} from '../models/user';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {of} from 'rxjs/observable/of';
import {Route, Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {UserService} from './user.service';
import { CookieService } from 'angular2-cookie/core';
import {Role} from '../models/role';


@Injectable()
export class AuthService {

  public userLoggedIn: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  constructor(private http: HttpClient, public userService: UserService, private router: Router,
              private cookieService: CookieService) {
    if (this.cookieService.get('email')) {
      const email = this.cookieService.get('email');
      this.userLoggedIn.next(new User( 0, email, email, ''));
    }
  }

  login(signInData) {
    const email = signInData.email;
    const password = signInData.password;

    // TODO remove credentials into header
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Basic'
      })
    };
    return this.http.post('/auth/login', {email, password}, httpOptions);
  }

  saveToken(token: string) {
    // var expireDate = new Date().getTime() + (1000 * token.expires_in);
    // Cookie.set("access_token", token.access_token, expireDate);
    // console.log('Obtained Access token');
    this.cookieService.put('a', 'a');
    this.cookieService.put(environment.ACCESS_TOKEN, token);
    // this._router.navigate(['/']);
  }

  logout() {
    this.cookieService.remove(environment.ACCESS_TOKEN);
    this.cookieService.remove('role');
    this.cookieService.remove('email');
    this.userLoggedIn.next(null);
    this.router.navigate(['/']);
  }

  register(signUpData) {
    const username = signUpData.username;
    const email = signUpData.email;
    const password = signUpData.password;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.post('/auth/signup', {username, email, password}, httpOptions);
  }

  isAdmin() {
    return this.userLoggedIn && this.cookieService.get('role') === 'ROLE_ADMIN';
  }

  getCurrentRoles() {
    return this.http.get<Role[]>('/api/users/me/roles');
  }
}
