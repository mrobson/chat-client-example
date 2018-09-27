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

    this.subscription1 = this.authService.duplicatedUserChanged
      .subscribe(
        (exist: boolean) => {
          if (exist) {
            this.duplicatedUser = true;
            this.errorMsg = 'The user name exist, please use other name';
            console.log('user exist');
          } else {
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
    this.authService.logout(this._cookieService.get('logined'));
  }

  isAuthenticated() {
    const id = this._cookieService.get('logined');

    this.logined_id = id !== undefined ? id : '';
    return id !== undefined;
  }
}
