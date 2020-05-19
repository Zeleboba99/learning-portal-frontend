import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Subject} from '../models/subject';
import {Course} from '../models/course';
import {log} from 'util';
import {UserService} from './user.service';
import {User} from '../models/user';
import {TestResult} from '../models/test-result';
import {CoursePage} from '../models/course-page';

@Injectable()
export class CourseService {
  u: User = new User(null, '', '', '');
  private base_url = '/api/courses';

  constructor(private http: HttpClient, private userService: UserService) {
  }

  getById(id: number): Observable<Course> {
    return this.http.get<Course>(this.base_url + '/' + id);
  }

  getById2(id: number): Observable<Course> {
    return this.http.get<Course>(this.base_url + '2' + '/' + id);
  }

  getAll(page: number, size: number, sortAsc: boolean): Observable<CoursePage> {
    if (!sortAsc) {
      return this.http.get<CoursePage>(this.base_url + '?page=' + page + '&size=' + size + '&sort=desc');
    }
    return this.http.get<CoursePage>(this.base_url + '?page=' + page + '&size=' + size + '&sort=asc');
  }

  getAllUnlocked(page: number, size: number, sortAsc: boolean): Observable<CoursePage> {
    if (!sortAsc) {
      return this.http.get<CoursePage>(this.base_url + '/unlocked' + '?page=' + page + '&size=' + size + '&sort=desc');
    }
    return this.http.get<CoursePage>(this.base_url + '/unlocked' + '?page=' + page + '&size=' + size + '&sort=asc');
  }

  getAllLocked(): Observable<Course[]> {
    return this.http.get<Course[]>(this.base_url + '/locked');
  }

  getAllBySubjectId(id: number, page: number, size: number, sortAsc: boolean): Observable<CoursePage> {
    if (!sortAsc) {
      return this.http.get<CoursePage>(this.base_url + '/by-subject-id/' + id + '?page=' + page + '&size=' + size + '&sort=desc');
    }
    return this.http.get<CoursePage>(this.base_url + '/by-subject-id/' + id + '?page=' + page + '&size=' + size + '&sort=asc');
  }

  getBySearchedName(courseName: string) {
    return this.http.get<Course[]>(this.base_url + '/by-name/' + courseName);
  }

  /*  public createCourse(course) {
      return this.http.post<Course>(this.base_url + '/course-create/', course);
    }
    public getSubject(subject) {
      return this.http.post<Subject>(this.base_url + '/get-subject/', subject);
    }*/
  createCourse(course) {
    const name = course.name;
    const description = course.description;
    const subject = course.subject.name;
    const authorOfCourse = course.authorOfCourse;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(this.base_url + '/create-course/', {name, description, subject, authorOfCourse}, httpOptions);
  }
  getAllCreatedCoursesForUser(id: number, page: number, size: number, sortAsc: boolean) {
    if (!sortAsc) {
      return this.http.get<CoursePage>(this.base_url + '/courses-by-user-id/' + id + '?page=' + page + '&size=' + size + '&sort=desc');
    }
    return this.http.get<CoursePage>(this.base_url + '/courses-by-user-id/' + id + '?page=' + page + '&size=' + size + '&sort=asc');
  }

  sendTestResult(testResult: TestResult, course_id: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(this.base_url + '/' + course_id + '/test-results', testResult, httpOptions);
  }

  getAllTestResults(course_id: number) {
    return this.http.get<TestResult[]>(this.base_url + '/' + course_id + '/test-results');
  }

  getPassedCourses() {
    return this.http.get<Course[]>(this.base_url + '/passed');
  }

  setLockToCourse(id: number, lock: boolean) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.patch(this.base_url + '/' + id + '/lock', lock, httpOptions);
  }
  unsubscribeFromCourse(id: number) {
    return this.http.delete(this.base_url + '/delete-course/' + id);
  }

  deleteCourse(course_id: number) {
    return this.http.delete(this.base_url + '/' + course_id);
  }
}
