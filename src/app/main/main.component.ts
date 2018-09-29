import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {AuthService} from '../shared/auth.service';
import {Router} from '@angular/router';
import {CookieService} from 'angular2-cookie/core';
import {Subscription} from 'rxjs';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  userForm: FormGroup;
  nickNameForm: FormGroup;
  public logined_id = '';
  subscription1 = new Subscription();
  public errorMsg: string;
  public duplicatedUser: boolean;

  constructor(private authService: AuthService,
              private router: Router,
              private _cookieService: CookieService) {

  }

  ngOnInit(): void {
    this.initForm();
    this.isAuthenticated();

    this.subscription1 = this.authService.errorCodeChanged
      .subscribe(
        (status: string) => {
          if (status === 'DUP_NAME') {
            this.duplicatedUser = true;
            this.errorMsg = 'The user name exist, please use other name';
            console.log('user exist');
          } else if (status === '503') {
            this.errorMsg = 'Auth Server Service Unavailable';
          } else if (status === '504') {
            this.errorMsg = 'Auth Server Gateway Timeout';
          } else {
            this.errorMsg = status;
            this.duplicatedUser = false;
          }
        }
      );
  }

  initForm() {
    this.userForm = new FormGroup({
      'id': new FormControl(),
      'pw': new FormControl()
    });

    this.nickNameForm = new FormGroup({
      'nickName': new FormControl()
    });


  }

  onLoginSubmit() {
    this.authService.login(this.userForm.value['id'], this.userForm.value['pw']);
  }

  onNickNameSubmit() {
    this.authService.withoutLogin(this.nickNameForm.value['nickName']);

  }

  onLogout() {
    this.authService.logout(this._cookieService.get('user'));
  }

  isAuthenticated() {
    const id = this._cookieService.get('user');

    this.logined_id = id !== undefined ? id : '';
    return id !== undefined;
  }
}
