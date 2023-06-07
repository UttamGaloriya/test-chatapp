import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { concatMap, switchMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ImageService } from 'src/app/services/image.service';
import { User } from 'firebase/auth';
import { NotificationService } from 'src/app/services/notification.service';
import { UserProfile } from 'src/app/user-profile';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  form!: FormGroup
  seasons: string[] = ['male', 'female', 'other'];

  user$ = this.userservices.currentUserProfile$;
  // useruserphoto$ = this.auth.currentUser$;

  editProfile: boolean = true
  constructor(private fb: FormBuilder,
    private auth: AuthService,
    private userservices: UsersService,
    private imageservice: ImageService,
    private notification: NotificationService,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      uid: [''],
      firstName: ['', [Validators.required, this.validateInput]],
      lastName: ['', [Validators.required, this.validateInput]],
      gender: ['', [Validators.required,]],
      userName: ['', [Validators.required, this.validateUser]],
    })


    this.userservices.currentUserProfile$
      .pipe(tap(console.log))
      .subscribe((user) => {
        console.log(user)
        this.form.patchValue({ ...user });
      });
    this.user$.pipe().subscribe()
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
      const { uid, ...data } = this.form.value;
      if (!uid) {
        return;
      }
      this.userservices.updateUser({ uid, ...data }).pipe().subscribe(
        (user) => { console.log(user), this.notification.showNotification("Data Update Sucessfuly", '', 'success') }
      )
      this.editProfile = !this.editProfile
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

  onEditProfile() {
    this.editProfile = !this.editProfile
  }

  uploadImage(event: any, user: UserProfile) {
    this.imageservice.uploadImage(event.target.files[0], `images/profile/${user?.uid}`).pipe(
      switchMap((photoURL) =>
        this.userservices.updateUser({ uid: user?.uid, photoURL }),
      )).subscribe(
        (data) => { this.notification.showNotification("Image Update Sucessfuly", '', 'success') }
      )
  }
}



