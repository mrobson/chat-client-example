import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ChatService} from '../shared/chat.service';
import {FormGroup, FormControl, FormArray, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AuthService} from '../shared/auth.service';
import {Subscription} from 'rxjs/Subscription';
import {Message} from '../shared/message.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  msgForm: FormGroup;
  public messages: Message[] = [];
  public connection;
  // public message: Message;
  // public id;
  public nickName;
  public logined = false;
  subscription1 = new Subscription();
  subscription2 = new Subscription();

  @ViewChild('scroll') private myScrollContainer: ElementRef;

  constructor(private chatService: ChatService,
              private authService: AuthService,
              private route: ActivatedRoute,
              private router: Router) {
  }


  ngOnInit() {

    this.subscription1 = this.route.params
      .subscribe(
        (params: Params) => {
          this.nickName = params['nickName'];
        }
      );


    this.subscription2 = this.chatService.allMessageChanged
      .subscribe(
        (allMsgs: Message[]) => {
          this.messages = allMsgs;
        }
      );
    this.chatService.getAllMessages();

    console.log(this.messages);
    this.connection = this.chatService.getMessages().subscribe((message: Message) => {
      this.messages.push(message);
    });

    this.initForm();
  }


  private initForm() {
    this.msgForm = new FormGroup(({
      'msg': new FormControl()
    }));
  }

  leaveChat() {

    this.authService.leave_chat(this.nickName);
    this.chatService.disconnect();
    this.router.navigate(['/']);

    console.log(this.nickName + ' left');
  }

  onSubmit() {
    this.chatService.sendMessage(this.nickName, this.msgForm.value['msg']);
    this.msgForm.reset();

  }

  ngOnDestroy(): void {
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
  }


}
