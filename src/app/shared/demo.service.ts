import {Subject} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Injectable} from '@angular/core';
import {Flow} from '../emulate/emulate.model';

@Injectable()
export class DemoService {
  private nodeJsUrl = 'http://' + environment.nodeJsUrl;
  private redhatLogo;
  public imageChanged = new Subject();
  public serverVersionChanged = new Subject<string>();
  public errorCodeChanged = new Subject<string>();
  public emulateResultChanged = new Subject<Flow[]>();

  constructor(private httpClient: HttpClient) {
  }


  public download_redhat_logo() {
    this.httpClient.get(this.nodeJsUrl + '/get_redhat_logo', {
      responseType: 'text',
      observe: 'body'
    }).subscribe(
      data => {
        this.redhatLogo = data;
        this.imageChanged.next(this.redhatLogo);
      },
      err => {
        console.log('Error is..:' + err);
        this.errorCodeChanged.next(err.statusText);
      }
    );

  }

  public getServerVersion() {

    this.httpClient.get(this.nodeJsUrl + '/get_server_version', {
      responseType: 'json',
      observe: 'body'
    }).subscribe(
      (response) => {
        console.log(response);
        const version: string = response['version'];
        this.serverVersionChanged.next(version);

      },
      err => {
        console.log(err);
        this.errorCodeChanged.next(err.statusText);
      }
    );
  }

  public emulate() {
    const data: HttpParams = new HttpParams().set('id', 'Emulator');
    this.httpClient.get(this.nodeJsUrl + '/emulate', {
      responseType: 'json',
      observe: 'body',
      params: data
    }).subscribe(
      (response) => {
        console.log(response);
        const flow: Flow[] = response['flow'];
        this.emulateResultChanged.next(flow);

      },
      err => {
        console.log(err);
        this.errorCodeChanged.next(err.statusText);
        const flow: Flow[] = err['error']['flow'];
        this.emulateResultChanged.next(flow);
      }
    );
  }
}
