import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Page} from '../models/page';

@Injectable()
export class PageService {

  private base_url = '/api';
  constructor(public http: HttpClient) { }

  getPagesForLesson(lesson_id: number): Observable<Page[]> {
    return this.http.get<Page[]>(this.base_url + '/lessons/' + lesson_id + '/pages');
  }

  getPageById(page_id: number): Observable<Page> {
    return this.http.get<Page>(this.base_url + '/pages/' + page_id);
  }

  createPage(page: Page, lesson_id: number, data) {
    return this.http.post(this.base_url + '/lessons/' + lesson_id + '/pages', data);
  }

  deleteById(page_id: number) {
    return this.http.delete(this.base_url + '/pages/' + page_id);
  }

  updatePage(page: Page, lesson_id: number) {
    const page_id = page.id;
    const number = page.number;
    const name = page.name;
    const content = page.content;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.put(this.base_url + '/lessons/' + lesson_id + '/pages/' + page_id, {page_id, number, name, content}, httpOptions);
  }
}
