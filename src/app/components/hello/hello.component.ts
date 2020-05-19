import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-hello',
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.css']
})
export class HelloComponent implements OnInit {
  highlighted = false;
  text = 'String s = 1;';
  constructor(public authService: AuthService, private router: Router) {
    if (this.authService.userLoggedIn.getValue()) {
      this.router.navigate(['/profile']);
    }
  }

  img1 = 'https://cdn4.iconfinder.com/data/icons/logos-and-brands-1/512/21_Angular_logo_logos-512.png';
  img3 = 'https://cdn4.iconfinder.com/data/icons/logos-and-brands-1/512/21_Angular_logo_logos-512.png';
  img2 = 'https://www.stickpng.com/assets/images/58480979cef1014c0b5e4901.png';
  private i = 0;

  ngOnInit(): void {
  }
}
