import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {User} from '../../models/user';
import {UserPage} from '../../models/user-page';
import {Role} from '../../models/role';
import {el} from '@angular/platform-browser/testing/src/browser_util';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  public users: User[] = [];
  public userPage: UserPage;
  size = 5;
  page = 1;
  selectedPage = 0;
  allRoles: Role[] = [];
  public adminRole: Role;
  public errMsg = '';
  public currentUser;
  selectedOption = 5;
  public options = [5, 25, 100];
  public sortAsc = true;
  constructor(private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private userService: UserService,
              private spinnerService: NgxSpinnerService) {
  }

  ngOnInit() {
    this.spinnerService.show();
    console.log('show');
    this.errMsg = '';
    this.userService.getLoggedInUser().subscribe(res => {
      this.currentUser = res;
      this.userService.getAllRoles().subscribe(
        res => {
          this.allRoles = res;
          for (let role of this.allRoles) {
            if (role.name === 'ROLE_ADMIN') {
              this.adminRole = role;
              console.log(this.adminRole);
            }
          }
        }
      );
      if (!this.authService.isAdmin()) {
        this.router.navigate(['catalog']);
      }
      this.getUsersPage(this.selectedPage, this.size);
    });
  }

  getUsersPage(page: number, size: number) {
    this.errMsg = '';
    this.userService.getAllUsers(page, size, this.sortAsc).subscribe(result => {
      this.userPage = result;
      this.users = this.userPage.content;
      this.spinnerService.hide();
      console.log('hide');
    });
  }

  onPageSelect(page: number): void {
    console.log('selected page : ' + page);
    this.selectedPage = page;
    this.getUsersPage(page, this.size);
  }

  isAdmin(roles: Role[]) {
    return !!roles.find((x) => x.name === 'ROLE_ADMIN');
  }

  onDowngradeClick(id: number) {
    if (id === this.currentUser.id) {
      console.log('You can`t downgrade yourself');
      this.errMsg = 'You can`t downgrade yourself';
    } else {
      this.userService.changeRole(id, ['ROLE_USER']).subscribe(
        res => this.ngOnInit()
      );
    }
  }

  onPromoteClick(id: number) {
    this.spinnerService.show();
    this.userService.changeRole(id, ['ROLE_USER', 'ROLE_ADMIN']).subscribe(
      res => this.ngOnInit()
    );
  }

  mySelectHandler($event: any) {
    this.size = $event;
    this.getUsersPage(this.selectedPage, this.size);
  }


  onSortClick() {
    this.sortAsc = !this.sortAsc;
    this.getUsersPage(this.selectedPage, this.size);
  }
}
