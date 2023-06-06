import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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



@NgModule({
  declarations: [
    NavbarComponent,
    ListUserComponent,
    FirstpageComponent,
    SettingComponent,
    FormComponent,
    ChatroomComponent,
    ChatuserlistComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatmodualsModule,
    ReactiveFormsModule,
  ]
})
export class HomeModule { }
