import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { HelloComponent } from './components/hello/hello.component';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ProfileComponent } from './components/profile/profile.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import {AuthService} from './services/auth.service';
import {UserService} from './services/user.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthenticationInterceptor} from './services/interceptors/authentication-interceptor';
import {BaseUrlInterceptor} from './services/interceptors/base-url-interceptor';
import { Oauth2RedirectHandlerComponent } from './components/oauth2-redirect-handler/oauth2-redirect-handler.component';
import {SubjectService} from './services/subject.service';
import {CatalogComponent} from './components/catalog/catalog.component';
import {CourseService} from './services/course.service';
import { CourseComponent } from './components/course/course.component';
import { MyCoursesComponent } from './components/my-courses/my-courses.component';
import { FilterPipe } from './pipes/filter.pipe';
import { FooterComponent } from './components/footer/footer.component';
import {AddCourseComponent} from './components/add-course/add-course.component';
import { EditLessonComponent } from './components/edit-lesson/edit-lesson.component';
import {LessonService} from './services/lesson.service';
import { LessonsComponent } from './components/lessons/lessons.component';
import { PagesComponent } from './components/pages/pages.component';
import {PageService} from './services/page.service';
import { EditPageComponent } from './components/edit-page/edit-page.component';
import { MyCreatedCoursesComponent } from './components/my-created-courses/my-created-courses.component';
import { TestQuestionsComponent } from './components/test-questions/test-questions.component';
import {TestService} from './services/test.service';
import { TestResultComponent } from './components/test-result/test-result.component';
 import { CookieService } from 'angular2-cookie/services/cookies.service';
import {AccessGuard} from './guards/access.guard';
import { EditTestComponent } from './components/edit-test/edit-test.component';
import {CertificatesComponent} from './components/certificates/certificates.component';
import {NgxSpinnerModule, NgxSpinnerService} from 'ngx-spinner';
import { LessonComponent } from './components/lesson/lesson.component';
import {UserManagementComponent} from './components/user-management/user-management.component';




@NgModule({
  declarations: [
    AppComponent,
    HelloComponent,
    CatalogComponent,
    ProfileComponent,
    SignInComponent,
    SignUpComponent,
    Oauth2RedirectHandlerComponent,
    CourseComponent,
    MyCoursesComponent,
    FilterPipe,
    FooterComponent,
    AddCourseComponent,
    EditLessonComponent,
    LessonsComponent,
    PagesComponent,
    EditPageComponent,
    MyCreatedCoursesComponent,
    TestQuestionsComponent,
    TestResultComponent,
    EditTestComponent,
    CertificatesComponent,
    UserManagementComponent,
    LessonComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(
      [
        {path: '', component: HelloComponent},
        {path: 'catalog', component: CatalogComponent},
        {path: 'profile', component: ProfileComponent, canActivate: [AccessGuard]},
        {path: 'sign-in', component: SignInComponent},
        {path: 'sign-up', component: SignUpComponent},
        {path: 'course', component: CourseComponent},
        {path: 'my-courses', component: MyCoursesComponent, canActivate: [AccessGuard]},
        {path: 'oauth2/redirect', component: Oauth2RedirectHandlerComponent},
        {path: 'add-course', component: AddCourseComponent, canActivate: [AccessGuard]},
        {path: 'edit-lesson', component: EditLessonComponent, canActivate: [AccessGuard]},
        {path: 'lessons', component: LessonsComponent, canActivate: [AccessGuard]},
        {path: 'pages', component: PagesComponent, canActivate: [AccessGuard]},
        {path: 'edit-page', component: EditPageComponent, canActivate: [AccessGuard]},
        {path: 'my-created-courses', component: MyCreatedCoursesComponent, canActivate: [AccessGuard]},
        {path: 'final-test', component: TestQuestionsComponent, canActivate: [AccessGuard]},
        {path: 'test-result', component: TestResultComponent, canActivate: [AccessGuard]},
        {path: 'edit-test', component: EditTestComponent, canActivate: [AccessGuard]},
        {path: 'certificates', component: CertificatesComponent, canActivate: [AccessGuard]},
        {path: 'user-management', component: UserManagementComponent, canActivate: [AccessGuard]},
        {path: 'lesson', component: LessonComponent, canActivate: [AccessGuard]}
      ]
    )
  ],
  providers: [
    AuthService,
    UserService,
    SubjectService,
    CourseService,
    LessonService,
    PageService,
    TestService,
    // NgxSpinnerService,
    { provide: CookieService, useFactory: cookieServiceFactory },
    // { provide: CookieOptions, useValue: {} },
    // CookieService,
    AccessGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BaseUrlInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
export function cookieServiceFactory() {
  return new CookieService();
}
