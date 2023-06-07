import { Injectable, Query } from '@angular/core';
import { collection, collectionData, doc, docData, Firestore, getDoc, query, setDoc, updateDoc, } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { UserProfile } from '../user-profile';
import { from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private firestore: Firestore, private authService: AuthService) { }


  get currentUserProfile$(): Observable<UserProfile | null> {
    return this.authService.currentUser$.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }
        const ref = doc(this.firestore, 'users', user?.uid);
        return docData(ref) as Observable<UserProfile>;
      })
    );
  }

  addUser(user: UserProfile) {
    const ref = doc(this.firestore, 'users', user.uid)
    return from(setDoc(ref, user));
  }

  updateUser(user: UserProfile): Observable<void> {
    const ref = doc(this.firestore, 'users', user.uid);
    return from(updateDoc(ref, { ...user }));
  }

  get allUsers$(): Observable<UserProfile[]> {
    const ref = collection(this.firestore, 'users');
    const queryAll = query(ref);
    return collectionData(queryAll) as Observable<UserProfile[]>
  }
}

