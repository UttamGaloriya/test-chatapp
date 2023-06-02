import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hide = false
  constructor(private fb: FormBuilder, private authServices: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, this.validateInput]],
      password: ['', [Validators.required, this.validatePassword]]
    })
  }

  login() {
    console.log(this.loginForm.value)
    if (this.loginForm.valid) {
      this.authServices.signIn(this.loginForm.value.email, this.loginForm.value.password).subscribe(
        (res) => { console.log(res), alert("login done") },
        (err) => { console.log(err) },
        () => { console.log("login complite"), this.router.navigateByUrl('/account/signup') }
      )
    }
  }
  //valdtion
  validateInput(control: FormControl) {
    const emailRegx =
      /^(([^<>+()\[\]\\.,;:\s@"-#$%&=]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;
    const trimmedValue = control.value.trim();
    if (trimmedValue === '') {
      return { spacesOnly: true };
    }
    if (emailRegx.test(trimmedValue)) {
      return { invalidInput: true };
    }
    if (trimmedValue !== control.value) {
      control.setValue(trimmedValue);
    }
    return null;
  }

  validatePassword(control: FormControl) {
    const passwordRegx = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
    const trimmedValue = control.value.trim();
    if (trimmedValue === '') {
      return { spacesOnly: true };
    }
    if (passwordRegx.test(trimmedValue)) {
      return { invalidInput: true };
    }
    if (trimmedValue.length <= 8) {
      return { passLength: true }
    }
    if (trimmedValue !== control.value) {
      control.setValue(trimmedValue);
    }
    return null;
  }


}

