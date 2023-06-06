import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AuthResponse } from '../authResponse';
import { Router } from '@angular/router';
import { Auth, UserInfo, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, } from '@angular/fire/auth';
import { from, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private apikey = "AIzaSyBd2qrxKb-n2ZFfo1HiwtF96SBwyhaDrEw"
  private apikey = "AIzaSyBd2qrxKb-n2ZFfo1HiwtF96SBwyhaDrEw"


  private getHeaders(): HttpHeaders {
    // Set the user's authentication token in the request headers
    const d = localStorage.getItem('DataToken')

    return new HttpHeaders().set('Authorization', `Bearer ${d}`);
  }
  constructor(private http: HttpClient, private router: Router, private afAuth: Auth) { }

  // signUp(email: string, password: string) {
  //   return this.http.post<AuthResponse>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBd2qrxKb-n2ZFfo1HiwtF96SBwyhaDrEw`,
  //     {
  //       email: email,
  //       password: password,
  //       returnSecureToken: true

  //     });
  // }
  // signIn(email: string, password: string): Observable<any> {
  //   return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBd2qrxKb-n2ZFfo1HiwtF96SBwyhaDrEw`,
  //     {
  //       email: email,
  //       password: password,
  //       returnSecureToken: true,
  //     });
  // }

  currentUser$ = authState(this.afAuth);


  signIn(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.afAuth, email, password))
  }

  signUp(email: string, password: string) {
    return from(createUserWithEmailAndPassword(this.afAuth, email, password))
  }

  updateProfileData(profileData: Partial<UserInfo>): Observable<any> {
    const user = this.afAuth.currentUser;
    return of(user).pipe(
      concatMap((user) => {
        if (!user) throw new Error('Not Authenticated');
        return updateProfile(user, profileData);
      })
    );
  }

  logout() {
    return from(this.afAuth.signOut());
  }

  //crud operatoin

  create(data: any): Observable<any> {
    return this.http.post(`https://skype-72562-default-rtdb.firebaseio.com/users.json`, {
      firstName: data.firstName,
      lastName: data.lastName,
      userName: data.userName,
      gender: data.gender,
    })
  }

  getData(): Observable<any> {
    return this.http.get(`https://skype-72562-default-rtdb.firebaseio.com/users.json`,)
  }

  sotreDataToken(data: any) {
    const mytoken = localStorage.getItem('DataToken')
    if (mytoken !== null) {
      localStorage.setItem('DataToken', JSON.stringify(data))
    } else {
      localStorage.setItem('DataToken', JSON.stringify(data))
    }
  }

  setToken() {
    localStorage.setItem('token', 'data')
  }

  removeToken() {
    localStorage.removeItem('token')
    this.router.navigateByUrl('/account/login')
  }

  get token() {
    const token = localStorage.getItem('token')
    if (token !== null) {
      return 1
    } else {
      return 0
    }
  }
}
