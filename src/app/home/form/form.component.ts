import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  form!: FormGroup
  seasons: string[] = ['male', 'female', 'other'];
  constructor(private fb: FormBuilder, private auth: AuthService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, this.validateInput]],
      lastName: ['', [Validators.required, this.validateInput]],
      gender: ['', [Validators.required,]],
      userName: ['', [Validators.required, this.validateUser]],


    })
  }

  validateInput(control: FormControl) {
    const trimmedValue = control.value.trim();
    if (trimmedValue === '') {
      return { spacesOnly: true };
    }
    if (!/^[a-zA-Z]+$/.test(trimmedValue)) {
      return { invalidInput: true };
    }
    if (trimmedValue !== control.value) {
      control.setValue(trimmedValue);
    }
    return null;
  }

  validateUser(control: FormControl) {
    const trimmedValue = control.value.trim();
    if (trimmedValue === '') {
      return { spacesOnly: true };
    }
    if (!/^[a-zA-Z0-9]+$/.test(trimmedValue)) {
      return { invalidInput: true };
    }
    if (trimmedValue !== control.value) {
      control.setValue(trimmedValue);
    }
    return null;
  }

  get f(): { [key: string]: AbstractControl } { return this.form.controls; }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
      this.auth.create(this.form.value).subscribe(
        (data) => { console.log(data) },
        (error) => { console.log(error) },
        () => { console.log("complite") }
      )

    } else {
      console.log("not valid")
    }


  }
  mydata() {
    this.auth.getData().subscribe(
      (data) => { console.log(data) },
      (error) => { console.log(error) },
      () => { console.log("complite") }
    )
  }
}
