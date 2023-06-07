import { Component, OnInit } from '@angular/core';
import { User } from 'firebase/auth';
import { concatMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { ImageService } from 'src/app/services/image.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormComponent } from '../form/form.component';
import { NotificationService } from 'src/app/services/notification.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  // user$ = this.authservices.currentUser$
  user$ = this.userservices.currentUserProfile$;
  constructor(private authservices: AuthService, private imgservices: ImageService, public dialog: MatDialog,
    private notification: NotificationService, private userservices: UsersService
  ) { }

  ngOnInit(): void {

  }
  logout() {
    this.authservices.removeToken()
  }
  uploadImage(event: any, user: User) {
    this.imgservices.uploadImage(event.target.files[0], `images/profile/${user.uid}`).pipe(
      concatMap((photoURL) =>
        this.authservices.updateProfileData({ photoURL })
      )).subscribe(
        (data) => { }
      )
  }
  Myprofile() {
    this.dialog.open(FormComponent)
  }
}
