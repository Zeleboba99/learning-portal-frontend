import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Subject} from '../models/subject';

@Injectable()
export class SubjectService {

  private base_url = '/api/subjects';

  constructor(private http: HttpClient) { }

  getById(id: number): Observable<Subject> {
    return this.http.get<Subject>(this.base_url + '/' + id);
  }

  getAll(): Observable<Subject[]> {
    return this.http.get<Subject[]>(this.base_url);
  }
}
