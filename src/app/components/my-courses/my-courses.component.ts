import {Component, DoCheck, OnChanges, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {Course} from '../../models/course';
import {NgxSpinnerService} from 'ngx-spinner';
import {CoursePage} from '../../models/course-page';
import {CourseService} from '../../services/course.service';

@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.css']
})
export class MyCoursesComponent implements OnInit, DoCheck {

  public checkCourses = false;
  public courses: Course[];
  public text = '';
  public coursePage: CoursePage;
  size = 5;
  page = 1;
  selectedPage = 0;
  selectedOption = 5;
  public options = [5, 25, 100];
  public sortAsc = true;
  constructor(private userService: UserService,
              private router: Router,
              private spinnerService: NgxSpinnerService,
              private courseService: CourseService) { }

  ngOnInit() {
    this.spinnerService.show();
    this.getCoursesPage(this.selectedPage, this.size);
  }

  getCoursesPage(page: number, size: number) {
    this.userService.getAllCoursesForUser(page, size, this.sortAsc).subscribe(result => {
      this.coursePage = result;
      this.courses = this.coursePage.content;
      this.spinnerService.hide();
    });
  }

  onSelectCourse(course_id: number) {
    this.router.navigate(['lessons'], {queryParams: {course_id: course_id}});
  }

  ngDoCheck(): void {
    if (this.courses.length > 0) {
      this.checkCourses = true;
    } else {
      this.checkCourses = false;
      this.text = 'You do not have training courses';
    }
  }

  onPageSelect(page: number): void {
    console.log('selected page : ' + page);
    this.selectedPage = page;
    this.getCoursesPage(page, this.size);
  }

  unSub(course_id: number) {
    this.courseService.unsubscribeFromCourse(course_id).subscribe(res =>
      this.router.navigate(['my-courses']));
      location.reload();
  }

  mySelectHandler($event: any) {
    this.size = $event;
    this.getCoursesPage(this.selectedPage, this.size);
  }

  onSortClick() {
    this.sortAsc = !this.sortAsc;
    this.getCoursesPage(this.selectedPage, this.size);
  }
}
