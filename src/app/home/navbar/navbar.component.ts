import { Component, OnInit } from '@angular/core';
import { User } from 'firebase/auth';
import { concatMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  user$ = this.authservices.currentUser$
  constructor(private authservices: AuthService, private imgservices: ImageService) { }

  ngOnInit(): void {
    this.user$.pipe().subscribe(
      (user) => console.log(user)
    )
  }
  logout() {
    this.authservices.removeToken()
  }
  uploadImage(event: any, user: User) {
    this.imgservices.uploadImage(event.target.files[0], `images/profile/${user.uid}`).pipe(
      concatMap((photoURL) =>
        this.authservices.updateProfileData({ photoURL })
      )).subscribe()
  }
}
