import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCreatedCoursesComponent } from './my-created-courses.component';

describe('MyCreatedCoursesComponent', () => {
  let component: MyCreatedCoursesComponent;
  let fixture: ComponentFixture<MyCreatedCoursesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyCreatedCoursesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCreatedCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
