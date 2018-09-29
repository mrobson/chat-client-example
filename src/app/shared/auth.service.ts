import {HttpClient, HttpHeaders, HttpParams, HttpRequest} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {CookieService} from 'angular2-cookie/core';
import {Subject} from 'rxjs';

@Injectable()
export class AuthService {

  private nodeJsUrl = 'http://' + environment.nodeJsUrl;
  private nickName;
  public errorCodeChanged = new Subject<string>();

  constructor(private httpClient: HttpClient,
              private router: Router,
              private _cookieService: CookieService) {
  }

  login(id: string, pw: string) {
    const headers: HttpHeaders = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    headers.append('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');

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
          this._cookieService.put('logined', 'true');
          this._cookieService.put('user', id);
          this.router.navigate(['chat', id]);
          this.errorCodeChanged.next('');
        } else {
          this.errorCodeChanged.next(status);
        }

      },
      err => {
        console.log(err);
        this.errorCodeChanged.next(err.statusText);
      }
    );

  }

  logout(id: string) {

    this._cookieService.remove('logined');
    this.nickName = '';
    this.leave_chat(id);


  }


  withoutLogin(nickName: any) {
    const headers: HttpHeaders = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    headers.append('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');

    const data: HttpParams = new HttpParams().set('nickName', nickName);

    this.httpClient.get(this.nodeJsUrl + '/join', {
      reportProgress: true,
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
          this.errorCodeChanged.next('');
        } else {
          this.errorCodeChanged.next(status);
        }

      },
      err => {
        console.log(err);
        this.errorCodeChanged.next(err.statusText);
      }
    );


  }


  leave_chat(nickName: any) {
    console.log('leave_chat');
    const headers: HttpHeaders = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    headers.append('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');

    const data: HttpParams = new HttpParams().set('nickName', nickName);

    this.httpClient.get(this.nodeJsUrl + '/leave', {
      reportProgress: true,
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
          this.errorCodeChanged.next('');
        }
      },
      err => {
        console.log(err);
        this.errorCodeChanged.next(err.statusText);
      }
    );


  }


}
