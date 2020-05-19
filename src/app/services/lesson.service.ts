import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Lesson} from '../models/lesson';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class LessonService {

  private base_url = '/api';
  constructor(public http: HttpClient) {
  }


  createLesson(lesson: Lesson, course_id: number) {
    const number = lesson.number;
    const name = lesson.name;
    const description = lesson.description;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(this.base_url + '/courses/' + course_id + '/lessons', {number, name, description}, httpOptions);
  }

  getAllLessonsForCourse(course_id: number): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(this.base_url + '/courses/' + course_id + '/lessons');
  }

  getLessonById(lesson_id: number): Observable<Lesson> {
    return this.http.get<Lesson>(this.base_url + '/lessons/' + lesson_id);
  }

  updateLesson(lesson: Lesson, course_id: number) {
    const id = lesson.id;
    const number = lesson.number;
    const name = lesson.name;
    const description = lesson.description;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.put(this.base_url + '/courses/' + course_id + '/lessons', {id, number, name, description}, httpOptions);
  }

  deleteById(lesson_id: number) {
    return this.http.delete(this.base_url + '/lessons/' + lesson_id);
  }
}

