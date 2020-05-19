import {Subject} from './subject';

export class Course {
  public id: number;
  public name: string;
  public description: string;
  public threshold: number;
  public subject: Subject;
  public authorOfCourse: number;
  public locked: boolean;
  constructor(name: string, description: string, subject: Subject, authorOfCourse: number) {
    this.name = name;
    this.description = description;
    this.subject = subject;
    this.authorOfCourse = authorOfCourse;
  }

}
