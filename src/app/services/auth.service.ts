import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AuthResponse } from '../authResponse';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private apikey = "AIzaSyBd2qrxKb-n2ZFfo1HiwtF96SBwyhaDrEw"
  private apikey = "AIzaSyBd2qrxKb-n2ZFfo1HiwtF96SBwyhaDrEw"
  constructor(private http: HttpClient) { }

  signUp(email: string, password: string) {
    return this.http.post<AuthResponse>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBd2qrxKb-n2ZFfo1HiwtF96SBwyhaDrEw`,
      {
        email: email,
        password: password,
        returnSecureToken: true

      });
  }
  signIn(email: string, password: string): Observable<any> {
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBd2qrxKb-n2ZFfo1HiwtF96SBwyhaDrEw`,
      {
        email: email,
        password: password,
        returnSecureToken: true,
      });
  }


}
