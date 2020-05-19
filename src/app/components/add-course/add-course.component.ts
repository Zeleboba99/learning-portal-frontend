import {Component, OnInit} from '@angular/core';
import {Course} from '../../models/course';
import {CourseService} from '../../services/course.service';
import {Subject} from '../../models/subject';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {log} from 'util';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css']
})

export class AddCourseComponent implements OnInit {
  course: Course = new Course('', '', new Subject(''), 0);
  public addMessage: any;
  public currentUser: User = new User(0, '', '', '');

  constructor(
    private courseService: CourseService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {
  }

  ngOnInit() {
    this.userService.getLoggedInUser().subscribe(
      user => this.currentUser = user
    );
  }

  reDir() {
    this.router.navigate(['/catalog']);
  }

  createCourse(): void {
    this.addMessage = 'Course adding...';
    this.courseService.createCourse(
      new Course(
        this.course.name,
        this.course.description,
        this.course.subject,
        this.currentUser.id)
    )
      .subscribe(data => {
        this.router.navigate(['lessons'], {queryParams: {course_id: data['id']}});
        // alert('Course add successfully.');
        // this.reDir();
        log(this.course.name);
      });
  }
}
