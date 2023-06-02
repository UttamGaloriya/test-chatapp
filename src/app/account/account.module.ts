import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { MatmodualsModule } from '../matmoduals/matmoduals.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { LayoutComponent } from './layout/layout.component';



@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    LayoutComponent,

  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    MatmodualsModule,
    ReactiveFormsModule,
    // AngularFireModule.initializeApp(environment.firebaseConfig),
  ]
})
export class AccountModule { }
