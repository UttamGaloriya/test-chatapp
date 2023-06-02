import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatmodualsModule } from './matmoduals/matmoduals.module';
// import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { AngularFireAuthModule } from '@angular/fire/compat/auth';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatmodualsModule,
    // AngularFireModule.initializeApp(environment.firebaseConfig),
    ReactiveFormsModule,
    HttpClientModule



  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
