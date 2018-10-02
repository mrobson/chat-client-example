import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {MainComponent} from './main/main.component';
import {ChatComponent} from './chat/chat.component';
import {ChatService} from './shared/chat.service';
import {AuthService} from './shared/auth.service';
import {CookieService} from 'angular2-cookie/core';
import {DemoService} from './shared/demo.service';
import { EmulateComponent } from './emulate/emulate.component';



@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    ChatComponent,
    EmulateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [ChatService, AuthService, DemoService, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
