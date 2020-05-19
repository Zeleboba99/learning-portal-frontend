import {Component, OnInit} from '@angular/core';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';
import {log} from 'util';
import {Router} from '@angular/router';
import {CourseService} from '../../services/course.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {AuthService} from '../../services/auth.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public currentUser: User = new User(0, '', '', '');
  public selectedFile;
  public numOfCreatedCourses = 0;
  imgURL: any;



  constructor(private userService: UserService,
              private authService: AuthService,
              private courseService: CourseService, private router: Router,
              private spinnerService: NgxSpinnerService) {
  }

  ngOnInit() {
    this.spinnerService.show();
    this.userService.getLoggedInUser().subscribe(
      user => {
        this.currentUser = user;
        if (this.authService.isAdmin()) {
          this.currentUser.status = 'Admin';
        } else {
          this.currentUser.status = 'User';
        }
        this.spinnerService.hide();
        this.courseService.getAllCreatedCoursesForUser(this.currentUser.id, 1, 1, true).subscribe(result => {
          console.log(result);
          this.numOfCreatedCourses = result.totalElements;
        });
      }
  );
    log(this.currentUser);
  }

  onFileChanged(event) {
    console.log(event);
    this.selectedFile = event.target.files[0];

    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (event2) => {
      this.imgURL = reader.result;
    };
  }

  onChangeImage() {
    const uploadData = new FormData();
    uploadData.append('profile_image', this.selectedFile, this.selectedFile.name);
    this.userService.uploadImageForProfile(uploadData).subscribe(
      res => {
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
          this.router.navigate(['profile']));
      },
      err => console.log('Error Occured duringng saving: ' + err)
    );
  }
}
