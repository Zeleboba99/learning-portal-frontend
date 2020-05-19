import { Component } from '@angular/core';
import {User} from './models/user';
import {environment} from '../environments/environment';
import {AuthService} from './services/auth.service';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {Router} from '@angular/router';
import {CourseService} from './services/course.service';
import {Course} from './models/course';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  userLoggedIn: User;
  public searchParam = '';
  public coursesList: Course[] = [];
  constructor(private authService: AuthService, private courseService: CourseService, private router: Router) {
    this.authService.userLoggedIn.subscribe(value => { this.userLoggedIn = value; });
    //courseService.getAll().subscribe(courses => this.coursesList = courses);
  }

  logout() {
    this.authService.logout();
  }

  onSearchClick(param) {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
      this.router.navigate(['catalog'], {queryParams: {search: param}}));
  }

  onCatalogClick() {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
      this.router.navigate(['catalog']));
  }
}
