export class Answer {
  public id: number;
  public content: string;
  public right: boolean;
  public selected: boolean;

  constructor(id: number, content: string, is_right: boolean) {
    this.id = id;
    this.content = content;
    this.right = is_right;
    this.selected = false;
  }
}
