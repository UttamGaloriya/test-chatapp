import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  hide = false
  constructor(private fb: FormBuilder, private authServices: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }
  signup() {
    if (this.signupForm.valid) {
      this.authServices.signUp(this.signupForm.value.email, this.signupForm.value.password).subscribe(
        (res) => { console.log(res), alert("signing done") },
        (err) => { console.log(err) },
        () => { console.log("login complite"), this.router.navigateByUrl('/account/login') }
      )
    }
  }
}


