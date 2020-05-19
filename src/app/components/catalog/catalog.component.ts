import { Component, OnInit } from '@angular/core';
import {Subject} from '../../models/subject';
import {SubjectService} from '../../services/subject.service';
import {CourseService} from '../../services/course.service';
import {Course} from '../../models/course';
import {el} from '@angular/platform-browser/testing/src/browser_util';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {CoursePage} from '../../models/course-page';


@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {

  public subjects: Subject[] = [];
  public courses: Course[] = [];
  public coursePage: CoursePage;
  size = 5;
  page = 1;
  selectedPage = 0;
  public selectedOption = 5;
  public options = [5, 25, 100];
  public searchParam = '';
  public sortAsc = true;
  constructor(private subjectService: SubjectService, private authService: AuthService, private courseService: CourseService,
              private router: Router,
              private route: ActivatedRoute,
              private userService: UserService,
              private spinnerService: NgxSpinnerService) {
    this.ngOnInit();
  }

  ngOnInit() {
    this.spinnerService.show();
    this.subjectService.getAll().subscribe(elements => this.subjects = elements);
    if (this.route.snapshot.queryParams['search']) {
      this.route.queryParams.subscribe(params => {
        this.searchParam = params['search'];
      });
      this.courseService.getBySearchedName(this.searchParam).subscribe(elements => {
        this.courses = elements;
        this.spinnerService.hide();
      });
    } else if (this.route.snapshot.queryParams['subject_id']) {
      let subject_id = 0;
      subject_id = this.route.snapshot.queryParams['subject_id'];
      this.courseService.getAllBySubjectId(subject_id, this.selectedPage, this.size, this.sortAsc).subscribe(coursesPage => {
        this.coursePage = coursesPage;
        this.courses = this.coursePage.content;
        this.spinnerService.hide();
      });
    } else {
        this.getCoursesPage(this.selectedPage, this.size);
    }
  }

  getCoursesPage(page: number, size: number) {
    if (this.route.snapshot.queryParams['subject_id']) {
      let subject_id = 0;
      subject_id = this.route.snapshot.queryParams['subject_id'];
      this.courseService.getAllBySubjectId(subject_id, this.selectedPage, this.size, this.sortAsc).subscribe(coursesPage => {
        this.coursePage = coursesPage;
        this.courses = this.coursePage.content;
        this.spinnerService.hide();
      });
    } else if (!this.authService.isAdmin()) {
      this.courseService.getAllUnlocked(page, size, this.sortAsc).subscribe(coursesPage => {
        this.coursePage = coursesPage;
        this.courses = this.coursePage.content;
        this.spinnerService.hide();
      });
    } else {
      this.courseService.getAll(page, size, this.sortAsc).subscribe(coursesPage => {
        this.coursePage = coursesPage;
        this.courses = this.coursePage.content;
        this.spinnerService.hide();
      });
    }
  }

  onPageSelect(page: number): void {
    console.log('selected page : ' + page);
    this.selectedPage = page;
    this.getCoursesPage(page, this.size);
  }

  onSelectSubject(subjectId: number) {
    // this.courseService.getAllBySubjectId(subjectId, this.selectedPage, this.size).subscribe(elements => this.courses = elements);
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
      this.router.navigate(['/catalog'], {queryParams: {subject_id: subjectId}}));
  }

  onSelectCourse(course: Course) {
    const user_id = 0;
    this.userService.getLoggedInUser().subscribe(res => {
      if (course.authorOfCourse === res.id) {
        this.router.navigate(['/lessons'], {queryParams: {course_id: course.id}});
      } else {
        this.userService.getCourseForCurrentUser(course.id).subscribe(result => {
          if (result != null) {
            this.router.navigate(['/lessons'], {queryParams: {course_id: course.id}});
          } else {
            this.router.navigate(['/course'], {queryParams: {id: course.id}});
          }
        });
      }
    },
      error => {
      this.router.navigate(['/course'], {queryParams: {id: course.id}});
    });
  }

  onBlock(id: number) {
    this.courseService.setLockToCourse(id, true).subscribe(
      res => this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
        this.router.navigate(['/catalog']))
    );
  }

  onUnlock(course: Course) {
    this.courseService.setLockToCourse(course.id, false).subscribe(
      res => this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
        this.router.navigate(['/catalog']))
    );
  }

  ck() {
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
