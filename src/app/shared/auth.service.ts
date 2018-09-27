import {HttpClient, HttpHeaders, HttpParams, HttpRequest} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {CookieService} from 'angular2-cookie/core';
import {Subject} from 'rxjs';

@Injectable()
export class AuthService {

  private nodeJsUrl = environment.nodeJsUrl;
  private nickName;
  public duplicatedUserChanged = new Subject<boolean>();

  constructor(private httpClient: HttpClient,
              private router: Router,
              private _cookieService: CookieService) {
  }

  login(id: string, pw: string) {

    const data: HttpParams = new HttpParams().set('id', id);
    data.append('pw', pw);

    this.httpClient.get('http://' + this.nodeJsUrl + ':3000/login', {
      responseType: 'json',
      observe: 'body',
      params: data
    }).subscribe(
      (response) => {
        console.log(response);
        const status: string = response['status'];
        if (status === 'OK') {

          this.nickName = id;
          this._cookieService.put('logined', id);
          this.router.navigate(['chat', id]);
        } else {
          this.duplicatedUserChanged.next(true);
        }
      },
      err => {
        console.log(err);
      }
    );

  }

  logout(id: string) {

    this._cookieService.remove('logined');
    this.nickName = '';
    this.leave_chat(id);


  }


  withoutLogin(nickName: any) {
    const headers: any = new Headers();
    const data: HttpParams = new HttpParams().set('nickName', nickName);

    this.httpClient.get('http://' + this.nodeJsUrl + ':3000/join', {
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
          this.nickName = nickName;
          this.router.navigate(['chat', nickName]);

        } else {
          this.duplicatedUserChanged.next(true);
        }

      },
      err => {
        console.log(err);
      }
    );


  }


  leave_chat(nickName: any) {
    console.log('leave_chat');
    const data: HttpParams = new HttpParams().set('nickName', nickName);

    this.httpClient.get('http://' + this.nodeJsUrl + ':3000/leave', {
      reportProgress: true,
      responseType: 'json',
      observe: 'body',
      params: data
    }).subscribe(
      (response) => {
        console.log(response);
        const status: string = response['status'];
        if (status === 'OK') {

          this.nickName = '';
          this.router.navigate(['/']);
        }
      },
      err => {
        console.log(err);
      }
    );


  }


}
