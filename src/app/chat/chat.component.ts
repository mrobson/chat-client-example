import {Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ChatService} from '../shared/chat.service';
import {FormGroup, FormControl} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AuthService} from '../shared/auth.service';
import {Subscription} from 'rxjs/Subscription';
import {Message} from '../shared/message.model';
import {DemoService} from '../shared/demo.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  msgForm: FormGroup;
  public messages: Message[] = [];
  public connection;

  public nickName;
  public logined = false;
  public serverVersion = 'aaa';
  subscription1 = new Subscription();
  subscription2 = new Subscription();
  subscription3 = new Subscription();
  subscription4 = new Subscription();

  @ViewChild('redhat_logo') private redhatLogoElement: ElementRef;
  @ViewChild('server_version') private serverVersionElement: ElementRef;


  constructor(private chatService: ChatService,
              private authService: AuthService,
              private demoService: DemoService,
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

    this.subscription3 = this.demoService.imageChanged
      .subscribe(
        image => {
          this.redhatLogoElement.nativeElement.style.backgroundImage = 'url(' + image + ')';
        }
      );

    this.subscription4 = this.demoService.serverVersionChanged
      .subscribe(
        (data: string) => {
          console.log('hel');
          console.log(data);
          this.serverVersion = data;
        }
      );

    this.connection = this.chatService.getMessages().subscribe((message: Message) => {
      this.messages.push(message);
    });

    this.demoService.download_redhat_logo();
    this.chatService.getAllMessages();
    this.demoService.getServerVersion();
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
    this.subscription3.unsubscribe();
    this.subscription4.unsubscribe();
  }


}
