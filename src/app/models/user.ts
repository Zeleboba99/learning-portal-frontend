import {Role} from './role';

export class User {
  public id: number;
  public name: string;
  public email: string;
  public image: any;
  public status: string;
  public about?: string;
  public token?: string;
  public roles: Role[];
  constructor(id: number, name: string, email: string, status: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.status = status;
    this.about = '';
    this.token = '';
  }
}
