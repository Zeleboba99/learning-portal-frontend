import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {User} from '../models/user';
import {Course} from '../models/course';
import {CoursePage} from '../models/course-page';
import {UserPage} from '../models/user-page';
import {Role} from '../models/role';

@Injectable()
export class UserService {
  private base_url = '/api/users';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };
  constructor(private http: HttpClient) { }

  getById(id: number): Observable<User> {
    return this.http.get<User>(this.base_url + '/by-id/' + id);
  }

  getByEmail(email: string): Observable<User> {
    return this.http.get<User>(this.base_url + '/by-email/' + email);
  }

  getLoggedInUser() {
    return this.http.get<User>(this.base_url + '/me');
  }

  getAllUsers(page: number, size: number, sortAsc: boolean) {
    if (!sortAsc) {
      return this.http.get<UserPage>(this.base_url + '?page=' + page + '&size=' + size + '&sort=desc');
    }
    return this.http.get<UserPage>(this.base_url + '?page=' + page + '&size=' + size + '&sort=asc');
  }

  addCourseForCurrentUser(course_id: number) {
    return this.http.post( this.base_url + '/me/courses/' + course_id, null, this.httpOptions);
  }

  getCourseForCurrentUser(course_id: number): Observable<Course> {
    return this.http.get<Course>(this.base_url + '/me/courses/' + course_id);
  }

  getAllCoursesForUser(page: number, size: number, sortAsc: boolean) {
    if (!sortAsc) {
      return this.http.get<CoursePage>(this.base_url + '/me/courses' + '?page=' + page + '&size=' + size + '&sort=desc');
    }
    return this.http.get<CoursePage>(this.base_url + '/me/courses' + '?page=' + page + '&size=' + size + '&sort=asc');
  }

  uploadImageForProfile(uploadData: FormData) {
    return this.http.patch(this.base_url + '/me/change-image', uploadData);
  }

  getAllRoles() {
    return this.http.get<Role[]>('/api/users/roles');
  }

  changeRole(user_id: number, roles: String[]) {
    return this.http.patch(this.base_url + '/' + user_id + '/change-role', roles, this.httpOptions);
  }
}
