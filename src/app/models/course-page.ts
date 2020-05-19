import {Course} from './course';

export class CoursePage {
  content: Course[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number ;
  first: boolean ;
  sort: string ;
  numberOfElements: number ;
}
