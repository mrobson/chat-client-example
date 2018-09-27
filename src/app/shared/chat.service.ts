import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import * as io from 'socket.io-client';
import {Message} from './message.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import 'rxjs/add/operator/map';
import {Subject} from 'rxjs';

@Injectable()
export class ChatService {
  private nodeJsUrl = 'http://' + environment.nodeJsUrl;
  private socket;
  private messageList: Message[] = [];
  public allMessageChanged = new Subject();

  constructor(private httpClient: HttpClient) {
  }

  public sendMessage(nickName, message) {
    console.log(message);
    this.socket.emit('add-message', nickName, message);
  }

  public getMessages() {
    const observable = new Observable(observer => {
      this.socket = io( this.nodeJsUrl );
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

    this.httpClient.get( this.nodeJsUrl + '/get_messages', {
      responseType: 'json',
      observe: 'body',
    }).subscribe(
      (data: Message[]) => {
        this.messageList = data;
        console.log(data);
        console.log(this.messageList);
        this.allMessageChanged.next(this.messageList.slice());

      },
      err => {
        console.log(err);
      }
    );
  }
}
