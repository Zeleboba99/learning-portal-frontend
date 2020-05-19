import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {CookieService} from 'angular2-cookie/core';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  public serverError: any;
  public successMessage: any;
  signUpData = {username: '', email: '', password: '', confirmPassword: ''};

  constructor(private authService: AuthService, private router: Router, private cookieService: CookieService) {
  }

  ngOnInit() {
  }
  
  register() {
    // TODO validation
    this.authService.register(this.signUpData)
      .subscribe(data => {
          if (data['message']) {
            this.successMessage = data['message'];
          }
          this.authService.login({email: this.signUpData.email, password: this.signUpData.password}).subscribe(
            signIndata => {
              if (signIndata['accessToken']) {
                this.authService.saveToken(signIndata['accessToken']);
                this.cookieService.put('email', this.signUpData.email);
                this.authService.userService.getLoggedInUser().subscribe(value => {
                  this.authService.userLoggedIn.next(value);
                  this.router.navigate(['/profile']);
                });
              }}
              );
        },
        message => {
          console.log(message.error.message);
          this.serverError = message.error.message;
        });
  }
}
