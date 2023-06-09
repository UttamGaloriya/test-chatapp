import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';
import { FirebaseError } from 'firebase/app';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hide = false
  err: any
  emailRegx = /^(([^<>+()\[\]\\.,;:\s@"-#$%&=]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;
  constructor(private fb: FormBuilder, private authServices: AuthService, private router: Router, private notification: NotificationService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(this.emailRegx)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(40), Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)]]
    })
  }

  login() {
    console.log(this.loginForm.value)
    if (this.loginForm.valid) {
      this.authServices.signIn(this.loginForm.value.email, this.loginForm.value.password).subscribe(
        (res) => {
          this.router.navigateByUrl('/')
          console.log(res),
            alert("login done")
        },
        (err) => { this.showError(err), this.notification.showNotification("Something wrong plese try again", "ok", "error") },
        () => {
          this.authServices.setToken()
          console.log("login complite"),
            this.notification.showNotification("login Successful", "ok", "success")
        }
      )
    }
  }

  showError(err: FirebaseError) {
    this.err = err.code.slice(5)
  }


}

