import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
// firebase
import { Auth, authState, getAuth } from '@angular/fire/auth';
import firebase from 'firebase/compat';
import {
  signInWithEmailAndPassword,
  User,
  UserCredential,
} from 'firebase/auth';
import {
  Firestore,
  doc,
  onSnapshot,
  DocumentReference,
  docSnapshots,
} from '@angular/fire/firestore';
// model
import { IUser } from './../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any;
  userLocalStorage = 'user';
  doc!: DocumentReference;

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private auth: Auth,
    private firestore: Firestore
  ) {
    // saving user data in localstorage when logged in and setting up null when logged out
    authState(this.auth).subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem(
          this.userLocalStorage,
          JSON.stringify(this.userData)
        );
        const userData = localStorage.getItem(this.userLocalStorage);
        if (userData) {
          JSON.parse(userData);
        }
      } else {
        localStorage.setItem(this.userLocalStorage, '');
        const userData = localStorage.getItem(this.userLocalStorage);
        if (userData) {
          JSON.parse(userData);
        }
      }
    });
  }

  signIn(email: string, passwrod: string) {
    return signInWithEmailAndPassword(this.auth, email, passwrod)
      .then((result: UserCredential) => {
        this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        });
        const user = result.user;
        if (user) {
          this.setUserData(user);
        } else {
          console.error('user not found');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */

  setUserData(user: User) {
    const userRef = (this.doc = doc(this.firestore, `users/${user.uid}`));
    const userData: IUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };

    console.log(user);
  }
}
