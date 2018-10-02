import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {CookieService} from 'angular2-cookie';
import {DemoService} from './demo.service';

@Injectable()
export class AuthService {

  private nodeJsUrl = 'http://' + environment.nodeJsUrl;
  private nickName;


  constructor(private httpClient: HttpClient,
              private demoService: DemoService,
              private router: Router,
              private _cookieService: CookieService) {
  }

  login(id: string, pw: string) {
    const headers: HttpHeaders = new HttpHeaders();

    const data: HttpParams = new HttpParams().set('id', id);
    data.append('pw', pw);


    this.httpClient.get(this.nodeJsUrl + '/login', {
      responseType: 'json',
      observe: 'body',
      headers: headers,
      params: data
    }).subscribe(
      (response) => {
        console.log(response);
        const status: string = response['status'];
        const msg: string = response['msg'];
        if (status === 'OK') {
          this.nickName = id;

          this.demoService.errorCodeChanged.next('');
          this._cookieService.put('logined', 'true');
          this._cookieService.put('user', id);
          this.router.navigate(['chat', id]);
        } else {
          this.demoService.errorCodeChanged.next(status);
        }

      },
      err => {
        console.log(err);
        this.demoService.errorCodeChanged.next(err.statusText);
      }
    );

  }

  logout(id: string) {

    this._cookieService.remove('logined');
    this._cookieService.remove('user');
    this.nickName = '';
    this.leave_chat(id);


  }


  withoutLogin(nickName: any) {
    const headers: HttpHeaders = new HttpHeaders();
    const data: HttpParams = new HttpParams().set('nickName', nickName);

    this.httpClient.get(this.nodeJsUrl + '/join', {
      responseType: 'json',
      observe: 'body',
      headers: headers,
      params: data
    }).subscribe(
      (response) => {
        console.log(response);
        const status: string = response['status'];
        const msg: string = response['msg'];
        if (status === 'OK') {
          this.nickName = nickName;
          this.router.navigate(['chat', nickName]);
          this.demoService.errorCodeChanged.next('');
        } else {
          this.demoService.errorCodeChanged.next(status);
        }

      },
      err => {
        console.log(err);
        this.demoService.errorCodeChanged.next(err.statusText);
      }
    );


  }


  leave_chat(nickName: any) {
    console.log('leave_chat');
    const headers: HttpHeaders = new HttpHeaders()
    const data: HttpParams = new HttpParams().set('nickName', nickName);

    this.httpClient.get(this.nodeJsUrl + '/leave', {
      responseType: 'json',
      observe: 'body',
      headers: headers,
      params: data
    }).subscribe(
      (response) => {
        console.log(response);
        const status: string = response['status'];
        if (status === 'OK') {
          this.nickName = '';
          this.router.navigate(['/']);
          this.demoService.errorCodeChanged.next('');
        }
      },
      err => {
        console.log(err);
        this.demoService.errorCodeChanged.next(err.statusText);
      }
    );


  }


}
