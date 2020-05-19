import { Component, OnInit } from '@angular/core';
import {Question} from '../../models/question';
import {ActivatedRoute, Router} from '@angular/router';
import {TestService} from '../../services/test.service';
import {Answer} from '../../models/answer';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-edit-test',
  templateUrl: './edit-test.component.html',
  styleUrls: ['./edit-test.component.css']
})
export class EditTestComponent implements OnInit {

  public error = '';
  public questions: Question[] = [];
  public selectedAnswers = new Map<number, number>();
  public lastQuestId = 0;
  survey: FormGroup;
  public course_id: number;
  public threshold;
  constructor(private testService: TestService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.course_id = params['course_id'];
    });

    this.survey = new FormGroup({
      sections: new FormArray([
        this.initSection(),
      ]),
    });
    // this.testService.getQuestionsByCourseId(this.course_id).subscribe(
    //   res => {
    //     this.questions = res;
    //     for (let i = 0; i < this.questions.length; i++) {
    //       this.initQuestion();
    //     }
    //   }
    // );
  }

  initSection() {
    return new FormGroup({
      questions: new FormArray([
        this.initQuestion()
      ])
    });
  }
  initQuestion() {
    this.lastQuestId += 1;
    return new FormGroup({
      questionId: new FormControl(this.lastQuestId),
      questionTitle: new FormControl('', Validators.required),
      questionType: new FormControl(''),
      options: new FormArray([
        this.initOptions(), this.initOptions()
      ]),
    });
  }

  initOptions() {
    return new FormGroup({
      // optionId: new FormControl(this.lastAnswerId),
      optionTitle: new FormControl('', Validators.required)
    });
  }

  addQuestion(j) {
    console.log(j);
    const control = <FormArray>this.survey.get(['sections', j, 'questions']);
    control.push(this.initQuestion());
  }

  add(i, j) {
    const control = <FormArray>this.survey.get(['sections', i, 'questions' , j, 'options']);
    control.push(this.initOptions());
  }

  getSections(form) {
    return form.controls.sections.controls;
  }
  getQuestions(form) {
    return form.controls.questions.controls;
  }
  getOptions(form) {
    return form.controls.options.controls;
  }

  removeQuestion(i, j) {
    const control = <FormArray>this.survey.get(['sections', i, 'questions']);
    control.removeAt(j);
    if (this.selectedAnswers.has(j)) {
      this.selectedAnswers.delete(j);
    }
  }

  removeOption(i, j, k) {
    console.log(i, j, k);
    const control = <FormArray>this.survey.get(['sections', i, 'questions', j, 'options']); // also try this new syntax
    control.removeAt(k);
    // todo check if remove choosen
    if (this.selectedAnswers.get(j) === k) {
      this.selectedAnswers.delete(j);
    } else if (this.selectedAnswers.get(j) > k) {
      this.selectedAnswers.set(j, this.selectedAnswers.get(j) - 1);
    }
  }

  remove(i, j) {
    const control =  <FormArray>this.survey.get(['sections', i, 'questions', j, 'options']);
    control.removeAt(0);
    control.controls = [];
  }

  onSubmit(form) {
    const questionList = this.survey.get(['sections', 0, 'questions']).value;
    if (!this.checkSelectedAnswers()) {
      this.error = 'Please, choose all right answers';
    } else {
      for (let question of questionList) {
        let answId = 1;
        const q = new Question(question.questionId, question.questionTitle);
        let keys = Array.from(this.selectedAnswers.keys());
        let minKey = Number(keys[0]);
        for (let j = 0; j < keys.length; j++) {
          if (Number(keys[j]) < minKey) {
            minKey = Number(keys[j]);
          }
        }
        let rightAnsw = this.selectedAnswers.get(minKey);
        this.selectedAnswers.delete(minKey);
        let i = 0;
        for (let answer of question.options) {
          let answ;
          if (i === rightAnsw) {
            answ = new Answer(answId, answer.optionTitle, true);
          } else {
            answ = new Answer(answId, answer.optionTitle, false);
          }
          q.answers.push(answ);
          i++;
          answId++;
        }
        this.questions.push(q);
      }
      console.log(this.survey);
      this.testService.createTest(this.questions, this.course_id, this.threshold).subscribe(res =>
        this.router.navigate(['lessons'], {queryParams: {course_id: this.course_id}}));
    }
  }

  checkSelectedAnswers() {
    const questCount = this.survey.get(['sections', 0, 'questions']).value.length;
    if (questCount === this.selectedAnswers.size) {
      if (!Array.from(this.selectedAnswers.values()).includes(-1)) {
        return true;
      }
    }
    return false;
  }

  onChange(j, k) {
    if (!this.selectedAnswers.has(j)) {
      this.selectedAnswers.set(j, k);
    } else {
      this.selectedAnswers[j] = k;
    }
  }
}
