import {Answer} from './answer';

export class Question {
  public id: number;
  public content: string;
  public answers: Answer[] = [];

  constructor(id: number, content: string) {
    this.id = id;
    this.content = content;
  }
}
