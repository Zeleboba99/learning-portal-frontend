import {AfterContentInit, AfterViewChecked, Component, DoCheck, OnChanges, OnInit} from '@angular/core';
import {Course} from '../../models/course';
import {UserService} from '../../services/user.service';
import {CourseService} from '../../services/course.service';
import {User} from '../../models/user';
import {log} from 'util';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {CoursePage} from '../../models/course-page';

@Component({
  selector: 'app-my-created-courses',
  templateUrl: './my-created-courses.component.html',
  styleUrls: ['./my-created-courses.component.css']
})
export class MyCreatedCoursesComponent implements OnInit, DoCheck  {

  public currentUser: User = new User(0, '', '', '');
  public courses: Course[] = [];
  public checkCourses = false;
  public text = '';
  public coursePage: CoursePage;
  size = 5;
  page = 1;
  selectedPage = 0;
  selectedOption = 5;
  public options = [5, 25, 100];
  public sortAsc = true;
  public deletedCourseId: number;
  constructor(
    private courseService: CourseService,
    private userService: UserService,
    private router: Router,
    private spinnerService: NgxSpinnerService
  ) {
  }

  ngOnInit() {
    this.spinnerService.show();
    this.userService.getLoggedInUser().subscribe(
      user => {
        this.currentUser = user;
        this.getCoursesPage(this.selectedPage, this.size);
        this.spinnerService.hide();
      }
    );
  }

  getCoursesPage(page: number, size: number) {
    this.courseService.getAllCreatedCoursesForUser(this.currentUser.id, page, size, this.sortAsc).subscribe(result => {
      this.coursePage = result;
      this.courses = this.coursePage.content;
      if (this.courses.length > 0) {
        this.checkCourses = true;
      } else {
        this.checkCourses = false;
        this.text = 'You do not create courses';
      }
      this.spinnerService.hide();
    });
  }

  onSelectCourse(course_id: number) {
    this.router.navigate(['lessons'], {queryParams: {course_id: course_id}});
  }

  onPageSelect(page: number): void {
    console.log('selected page : ' + page);
    this.selectedPage = page;
    this.getCoursesPage(page, this.size);
  }

  ngDoCheck(): void {
  }

  mySelectHandler($event: any) {
    this.size = $event;
    this.getCoursesPage(this.selectedPage, this.size);
  }

  onSortClick() {
    this.sortAsc = !this.sortAsc;
    this.getCoursesPage(this.selectedPage, this.size);
  }

  onDeleteClick(course_id: number) {
    this.deletedCourseId = course_id;
  }

  onConfirmDeleteClick() {
    this.courseService.deleteCourse(this.deletedCourseId).subscribe(
      res => this.ngOnInit()
    );
  }
}
