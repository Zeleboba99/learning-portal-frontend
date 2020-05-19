import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PageService} from '../../services/page.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {Page} from '../../models/page';

import 'prismjs';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-javascript';
import {LessonService} from '../../services/lesson.service';
import {Lesson} from '../../models/lesson';
import {User} from '../../models/user';
import {Course} from '../../models/course';
import {UserService} from '../../services/user.service';
import {CourseService} from '../../services/course.service';

declare var Prism: any;

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.css']
})
export class LessonComponent implements OnInit {

  public lesson_id: number;
  public course_id: number;
  public pages: Page[] = [];
  public lesson: Lesson;
  languageIdentifier = 'java';
  public nextLesson: Lesson;
  public previousLesson: Lesson;
  public isAuthor = false;
  public currentUser: User;
  public course: Course;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private pageService: PageService,
              private lessonService: LessonService,
              private userService: UserService,
              private courseService: CourseService,
              private spinnerService: NgxSpinnerService) { }

  ngOnInit() {
    this.spinnerService.show();
    this.route.queryParams.subscribe(params => {
      this.lesson_id = params['lesson_id'];
      this.course_id = params['course_id'];
      this.userService.getLoggedInUser().subscribe(
        user => {
          this.currentUser = user;
          this.courseService.getById(this.course_id).subscribe(course => {
            this.course = course;
            this.isAuthor = this.currentUser.id === this.course.authorOfCourse;
            this.spinnerService.hide();
          });
        });
      this.lessonService.getLessonById(this.lesson_id).subscribe(
        les => {
          this.lesson = les;
          this.lessonService.getAllLessonsForCourse(this.course_id).subscribe(
            result => {
              this.nextLesson = result.filter(l => l.number === this.lesson.number + 1)[0];
              this.previousLesson = result.filter(l => l.number === this.lesson.number - 1)[0];
            }
          );
          this.pageService.getPagesForLesson(this.lesson_id).subscribe(
            res => {
              this.pages = res;
              for (let p of this.pages) {
                if (p.pageType.typeName === 'code') {
                  p.content = Prism.highlight(p.content, Prism.languages[this.languageIdentifier]);
                }
              }
              this.spinnerService.hide();
            }
          );
        }
      );
    });
  }
  onBackToLessonsClick() {
    this.router.navigate(['lessons'], {queryParams: {course_id: this.course_id}});
  }

  onPreviousLessonClick() {
    this.router.navigate(['lesson'], {queryParams: {course_id: this.course_id, lesson_id: this.previousLesson.id}});
  }

  onNextLessonClick() {
    this.router.navigate(['lesson'], {queryParams: {course_id: this.course_id, lesson_id: this.nextLesson.id}});
  }

  onPagesClick() {
    this.router.navigate(['pages'], {queryParams: {course_id: this.course_id, lesson_id: this.lesson_id}});
  }
}
