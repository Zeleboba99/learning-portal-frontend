import {Component, OnInit} from '@angular/core';
import {CourseService} from '../../services/course.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Course} from '../../models/course';
import {UserService} from '../../services/user.service';
import {log} from 'util';
import {Subject} from '../../models/subject';
import {User} from '../../models/user';
import {LessonService} from '../../services/lesson.service';
import {Lesson} from '../../models/lesson';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  course: Course = new Course('', '', new Subject(''), 0);
  idOfCourse: number;

  public isUserAlreadyJoined: boolean;
  public lessons: Lesson[] = [];
  public author =  '';

  constructor(private courseService: CourseService, private route: ActivatedRoute, private userService: UserService,
              private lessonService: LessonService,
              private router: Router,
              private spinnerService: NgxSpinnerService) {
  }

  ngOnInit() {
    let id = 0;
    this.route.queryParams.subscribe(params => {
      id = params['id'];
      this.idOfCourse = params['id'];
      if (this.idOfCourse) {
        this.spinnerService.show();
      }
    });
    this.userService.getCourseForCurrentUser(id).subscribe(result => {
      this.isUserAlreadyJoined = result != null;
    });
    this.courseService.getById(id).subscribe(res => {
        this.course = res;
        if (this.course.authorOfCourse) {
          this.userService.getById(this.course.authorOfCourse).subscribe(x => {
            this.author = x.name;
            this.spinnerService.hide();
          });
        }
      }
    );
    this.lessonService.getAllLessonsForCourse(id).subscribe(res => this.lessons = res);
  }

  onJoinToCourseClick() {
    this.userService.getLoggedInUser().subscribe(res1 => {
      this.userService.addCourseForCurrentUser(this.course.id).subscribe(res =>
        this.onGoToTheCourseClick()
      );
    },
      error => {
      this.router.navigate(['sign-in']);
      }
    );
  }

  onGoToTheCourseClick() {
    this.router.navigate(['lessons'], {queryParams: {course_id: this.course.id}});
  }
}
