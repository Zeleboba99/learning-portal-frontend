export class TestResult {
  public id: number;
  public number: number;
  public passedAt: Date;
  public answersNum: number;
  public rightAnswersNum: number;

  constructor(id: number, number: number, passedAt: Date, answersNum: number, rightAnswersNum: number) {
    this.id = id;
    this.number = number;
    this.passedAt = passedAt;
    this.answersNum = answersNum;
    this.rightAnswersNum = rightAnswersNum;
  }
}
