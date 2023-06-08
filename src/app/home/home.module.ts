import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { ListUserComponent } from './list-user/list-user.component';
import { FirstpageComponent } from './firstpage/firstpage.component';
import { SettingComponent } from './setting/setting.component';
import { MatmodualsModule } from '../matmoduals/matmoduals.module';
import { FormComponent } from './form/form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatroomComponent } from './chatroom/chatroom.component';
import { ChatuserlistComponent } from './chatuserlist/chatuserlist.component';
import { DateDisplayPipe } from '../pipe/date-display.pipe';



@NgModule({
  declarations: [
    NavbarComponent,
    ListUserComponent,
    FirstpageComponent,
    SettingComponent,
    FormComponent,
    ChatroomComponent,
    ChatuserlistComponent,
    DateDisplayPipe
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatmodualsModule,
    ReactiveFormsModule,

  ],
  providers: []

})
export class HomeModule { }
