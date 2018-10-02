import {Observable} from 'rxjs/Observable';
import * as io from 'socket.io-client';
import {Message} from './message.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import 'rxjs/add/operator/map';
import {Subject} from 'rxjs';
import {DemoService} from './demo.service';
import {Injectable} from '@angular/core';

@Injectable()
export class ChatService {

  private nodeJsUrl = 'http://' + environment.nodeJsUrl;
  private socket;
  private messageList: Message[] = [];
  public allMessageChanged = new Subject();


  constructor(private httpClient: HttpClient,
              private demoService: DemoService) {
  }

  public sendMessage(nickName, message) {
    console.log(message);
    this.socket.emit('add-message', nickName, message);
  }

  public getMessages() {
    const observable = new Observable(observer => {
      this.socket = io(this.nodeJsUrl);
      this.socket.on('message', (message: Message) => {
        observer.next(message);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  disconnect() {
    console.log('disconnect');
    this.socket.close();
  }


  public getAllMessages() {
    const headers: HttpHeaders = new HttpHeaders();

    this.httpClient.get(this.nodeJsUrl + '/get_messages', {
      responseType: 'json',
      observe: 'body',
      headers: headers,
    }).subscribe(
      (data: Message[]) => {
        if (data !== null) {
          this.messageList = data;
          console.log(data);
          console.log(this.messageList);
          this.allMessageChanged.next(this.messageList.slice());
        }
      },
      err => {
        this.demoService.errorCodeChanged.next(err.statusText);
      }
    );
  }

}
