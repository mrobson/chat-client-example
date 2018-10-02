import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AppComponent} from './app.component';
import {MainComponent} from './main/main.component';
import {ChatComponent} from './chat/chat.component';
import {EmulateComponent} from './emulate/emulate.component';



const appRoutes: Routes = [
  {path: '', component: MainComponent},
  {path: 'chat/:nickName', component: ChatComponent},
  {path: 'emulate', component: EmulateComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
