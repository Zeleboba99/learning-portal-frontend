import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Lesson} from '../../models/lesson';
import {LessonService} from '../../services/lesson.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-edit-lesson',
  templateUrl: './edit-lesson.component.html',
  styleUrls: ['./edit-lesson.component.css']
})
export class EditLessonComponent implements OnInit {

  public lesson = new Lesson();
  public course_id: number;
  public numToInsert: number;
  public lessons: Lesson[];
  constructor(private route: ActivatedRoute, private router: Router, private lessonService: LessonService,
              private spinnerService: NgxSpinnerService) { }

  ngOnInit() {
    let lesson_id = 0;
    this.route.queryParams.subscribe(params => {
      lesson_id = params['lesson_id'];
      this.course_id = params['course_id'];
      if (this.course_id && lesson_id) {
        this.spinnerService.show();
      }
      this.lessonService.getAllLessonsForCourse(this.course_id).subscribe(res => this.lessons = res);
    });
    if (lesson_id !== 0) {
      this.lessonService.getLessonById(lesson_id).subscribe(lesson => this.lesson = lesson);
    // TODO update lesson
    }
    this.spinnerService.hide();
  }

  createLesson() {
    if (this.numToInsert) {
      this.lesson.number = this.numToInsert;
    } else {
      this.lesson.number = this.lessons.length + 1;
    }
    this.lessonService.createLesson(this.lesson, this.course_id).subscribe(
      next => this.router.navigate(['lessons'], {queryParams: {course_id: this.course_id}}));
  }

  updateLesson() {
    this.lessonService.updateLesson(this.lesson, this.course_id).subscribe(
      next => this.router.navigate(['lessons'], {queryParams: {course_id: this.course_id}}));
  }
}
