import { Component, OnInit } from '@angular/core';
import {TestService} from '../../services/test.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Question} from '../../models/question';
import {Answer} from '../../models/answer';
import {a} from '@angular/core/src/render3';
import {CourseService} from '../../services/course.service';
import {TestResult} from '../../models/test-result';
import {NgxSpinnerService} from 'ngx-spinner';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import './../../../assets/smtp.js';
import {Course} from '../../models/course';
import {AuthService} from '../../services/auth.service';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';
declare let Email: any;
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-test-questions',
  templateUrl: './test-questions.component.html',
  styleUrls: ['./test-questions.component.css']
})
export class TestQuestionsComponent implements OnInit {

  public questions: Question[] = [];
  public course_id: number;
  public course: Course;
  public currentUser: User;
  public isAuthor = false;
  public selectedAnswers = new Map<number, number>();

  constructor(private route: ActivatedRoute,
              private testService: TestService,
              private courseService: CourseService,
              private authService: AuthService,
              private userService: UserService,
              private router: Router,
              private spinnerService: NgxSpinnerService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.course_id = params['course_id'];
      if (this.course_id) {
        this.spinnerService.show();
        this.userService.getLoggedInUser().subscribe(
          user => {
            this.currentUser = user;
            this.courseService.getById(this.course_id).subscribe(course => {
              this.course = course;
              this.isAuthor = this.currentUser.id === this.course.authorOfCourse;
              this.spinnerService.hide();
            });
            this.testService.getQuestionsByCourseId(this.course_id).subscribe(
              res => {
                this.questions = res;
                for (let i = 0; i < this.questions.length; i++) {
                  this.testService.getAnswersForQuestion(this.questions[i].id).subscribe(
                    answers => {
                      this.questions[i].answers = answers;
                      this.selectedAnswers.set(this.questions[i].id, this.questions[i].answers[0].id);
                      this.spinnerService.hide();
                    }
                  );
                }
              }
            );
          }
        );
      }
    });
  }

  submitAnswers() {
    let result = 0;
    for (let question of this.questions) {
      let rightAnswer;
      for (let answ of question.answers) {
        if (answ.right === true) {
          rightAnswer = answ;
        }
      }
      if (this.selectedAnswers.get(question.id) === rightAnswer.id) {
        result += 1;
      }
    }
    const testResult = new TestResult(null, null, null, this.questions.length, result);
    if ((result * 100 / this.questions.length) >= 75) {
      const course = this.courseService.getById(this.course_id).subscribe(res => this.sendEmail(res));
    }
    this.courseService.sendTestResult(testResult, this.course_id).subscribe(res =>
      this.router.navigate(['test-result'], {queryParams: {result: result, course_id: this.course_id, questNum: this.questions.length}})
    );
  }

  onSelectRadioChange(question: Question, answer: Answer) {
    this.selectedAnswers.set(question.id, answer.id);
  }

  sendEmail(course: Course) {
      Email.send({
        Host : 'smtp.elasticemail.com',
        Username : 'katee241199@gmail.com',
        Password : '7C01D529207D9E727F3A98A1DC36C9084CB0',
        To : this.authService.userLoggedIn.value.email,
        From : 'katee241199@gmail.com',
        Subject : 'Learning portal',
        Body : '<h3>Congratulations!</h3> <i>You successfully passed the course ' + course.name + '! <p>Check your <a href="https://portal-angular.herokuapp.com/certificates">certificates</a> for downloading it</p></i> <b>With Love your, Learning Portal.</b>'
      });
  }

  onChangeTest() {
    this.router.navigate(['edit-test'], {queryParams: {course_id: this.course_id}});
  }
}
