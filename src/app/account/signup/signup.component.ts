import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { concatMap, switchMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UsersService } from 'src/app/services/users.service';
import { ImageService } from 'src/app/services/image.service';
import { FirebaseError } from 'firebase/app';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  loading: boolean = false
  hide = false
  err?: any
  emailRegx = /^(([^<>+()\[\]\\.,;:\s@"-#$%&=]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;
  constructor(private fb: FormBuilder,
    private authServices: AuthService,
    private router: Router, private notification: NotificationService,
    private usersService: UsersService,
    private imageservice: ImageService,) { }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      imagefile: [''],
      email: ['', [Validators.required, Validators.pattern(this.emailRegx)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(40), Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)]]
    })
  }
  signup() {
    this.loading = true
    if (this.signupForm.valid) {
      console.log("work")
      const email = this.signupForm.value.email
      this.authServices.signUp(email, this.signupForm.value.password).pipe(
        switchMap(({ user: { uid } }) =>
          this.usersService.addUser({ uid, email }),
        ),
        tap((res) => console.log(res)),
      )
        .subscribe(
          (res) => { this.loading = false, this.router.navigateByUrl('/account/login'), console.log(res), this.notification.showNotification("Account create ", "ok", "success") },
          (err) => { this.loading = false, this.showError(err), this.notification.showNotification("Something wrong", "ok", "error") },
          () => { console.log("login complite") }
        )
    }
  }
  showError(err: FirebaseError) {
    this.err = err.code.slice(5)
  }

}


