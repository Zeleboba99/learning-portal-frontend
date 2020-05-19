import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TestService} from '../../services/test.service';
import {CourseService} from '../../services/course.service';
import {TestResult} from '../../models/test-result';
import {Course} from '../../models/course';

@Component({
  selector: 'app-test-result',
  templateUrl: './test-result.component.html',
  styleUrls: ['./test-result.component.css']
})
export class TestResultComponent implements OnInit {

  public course: Course;
  public course_id: number;
  public result: number;
  public questNum: number;
  public testResults: TestResult[] = [];
  public lastResult: number;
  constructor(private route: ActivatedRoute,
              private testService: TestService,
              private courseService: CourseService,
              private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.course_id = params['course_id'];
      this.result = params['result'];
      this.questNum = params['questNum'];
    });
    this.courseService.getById(this.course_id).subscribe(
      courseRes => {
        this.course = courseRes;
        this.courseService.getAllTestResults(this.course_id).subscribe(res => {
          this.testResults = res;
          this.testResults.sort(function(a, b) {
            return a.number > b.number ? 1 : a.number < b.number ? -1 : 0;
          });
          this.lastResult = this.testResults[this.testResults.length - 1].rightAnswersNum * 100 / this.testResults[this.testResults.length - 1].answersNum;
        });
      }
    );
  }

  onBaskToLessonsClick() {
    this.router.navigate(['lessons'], {queryParams: {course_id: this.course_id}});
  }

  onTryAgainClick() {
    this.router.navigate(['final-test'], {queryParams: {course_id: this.course_id}});
  }

  onGoToTheCertificates() {
    this.router.navigate(['certificates']);
  }
}
