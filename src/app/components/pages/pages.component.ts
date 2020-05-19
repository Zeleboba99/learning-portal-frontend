import {Component, DoCheck, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {PageService} from '../../services/page.service';
import {Page} from '../../models/page';
import {User} from '../../models/user';
import {CourseService} from '../../services/course.service';
import {LessonService} from '../../services/lesson.service';
import {Course} from '../../models/course';
import {NgxSpinnerService} from 'ngx-spinner';
import {AuthService} from '../../services/auth.service';

import 'prismjs';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-javascript';

declare var Prism: any;


@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit, DoCheck {
  private currentUser: User = new User(0, '', '', '');
  public isAuthor = true;
  public course: Course;
  public page_number = 1;
  public lesson_id: number;
  public course_id: number;
  public pages: Page[];
  public currentPage: Page;
  public showNextButton = false;
  public showPreviousButton = false;
  public deletedPageId = 0;
  languageIdentifier = 'java';
  constructor(private route: ActivatedRoute,
              private router: Router,
              private pageService: PageService,
              private userService: UserService,
              private courseService: CourseService,
              private spinnerService: NgxSpinnerService,
              public authService: AuthService
  ) {
  }

  ngOnInit() {
    this.spinnerService.show();
    this.route.queryParams.subscribe(params => {
      this.lesson_id = params['lesson_id'];
      this.course_id = params['course_id'];
    });
    this.pageService.getPagesForLesson(this.lesson_id).subscribe(result => {
      this.pages = result;
      for (let p of this.pages) {
        if (p.pageType.typeName === 'code') {
          p.content = Prism.highlight(p.content, Prism.languages[this.languageIdentifier]);
        }
      }
      this.spinnerService.hide();
      this.currentPage = this.pages.find(target => target.number === this.page_number);
      if (this.pages.length > 1) {
        this.showNextButton = true;
      }
    });
    this.userService.getLoggedInUser().subscribe(
      user => {this.currentUser = user;
        this.spinnerService.hide();
      }
    );
    this.courseService.getById(this.course_id).subscribe(course => this.course = course);
  }


  onNextPageClick() {
    const previousNumber = this.currentPage.number;
    this.showPreviousButton = true;
    if (this.pages.length !== this.currentPage.number) {
      this.currentPage = this.pages.find(target => target.number === previousNumber + 1);
      this.page_number = previousNumber + 1;
      if (this.pages.length === this.currentPage.number) {
        this.showNextButton = false;
      }
    }
  }

  onPreviousPageClick() {
    const curNumber = this.currentPage.number;
    this.showNextButton = true;
    this.currentPage = this.pages.find(target => target.number === curNumber - 1);
    this.page_number = curNumber - 1;
    if (this.page_number === 1) {
      this.showPreviousButton = false;
    }
  }

  onBackToLessonsClick() {
    this.router.navigate(['lessons'], {queryParams: {course_id: this.course_id}});
  }

  onDeleteClick(page_id: number) {
    this.deletedPageId = page_id;
  }

  onEditPageClick(page_id: number) {
    this.router.navigate(['edit-page'], {queryParams: {course_id: this.course_id, lesson_id: this.lesson_id, page_id: page_id, type: this.currentPage.pageType.typeName}});
  }
  ngDoCheck(): void {
    if (this.currentUser.id !== this.course.authorOfCourse) {
      this.isAuthor = false;
    } else {
      this.isAuthor = true;
    }
  }

  onConfirmDeleteClick() {
    this.pageService.deleteById(this.deletedPageId).subscribe(res =>
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
        this.router.navigate(['pages'], {queryParams: {course_id: this.course_id, lesson_id: this.lesson_id}})));
  }

  onAddPagePictureClick() {
    this.router.navigate(['edit-page'], {queryParams: {course_id: this.course_id, lesson_id: this.lesson_id, type: 'image'}});
  }

  onAddPageTextClick() {
    this.router.navigate(['edit-page'], {queryParams: {course_id: this.course_id, lesson_id: this.lesson_id, type: 'text'}});
  }

  onAddPageCodeClick() {
    this.router.navigate(['edit-page'], {queryParams: {course_id: this.course_id, lesson_id: this.lesson_id, type: 'code'}});
  }

  onViewLessonClick() {
    this.router.navigate(['lesson'], {queryParams: {course_id: this.course_id, lesson_id: this.lesson_id}});
  }
}
