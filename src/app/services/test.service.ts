import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Question} from '../models/question';
import {Answer} from '../models/answer';

@Injectable()
export class TestService {

  private base_url = '/api';
  constructor(public http: HttpClient) { }

  getQuestionsByCourseId(course_id: number) {
    return this.http.get<Question[]>(this.base_url + '/courses/' + course_id + '/questions');
  }

  getAnswersForQuestion(question_id: number) {
    return this.http.get<Answer[]>(this.base_url + '/questions/' + question_id + '/answers');
  }

  createTest(questions: Question[], course_id: number, threshold: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(this.base_url + '/courses/' + course_id + '/tests?threshold=' + threshold,  questions, httpOptions);
  }
}
