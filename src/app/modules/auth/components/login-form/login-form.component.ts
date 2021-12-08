import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Component, OnInit } from '@angular/core';
// services
import { AuthService } from '../../services/auth.service';
import {
  Firestore,
  doc,
  onSnapshot,
  DocumentReference,
  docSnapshots,
  collection,
  firestoreInstance$,
  collectionData,
} from '@angular/fire/firestore';
import {
  Auth,
  GoogleAuthProvider,
  signInAnonymously,
  signInWithPopup,
} from '@angular/fire/auth';
import { concatMap, first } from 'rxjs/operators';
import { signOut, User, UserCredential } from 'firebase/auth';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  private doc!: DocumentReference;
  user!: User;

  constructor(
    private authService: AuthService,
    private firestore: Firestore,
    public auth: Auth
  ) {
    firestoreInstance$
      .pipe(
        first(),
        concatMap((firestoreg) => {
          return collectionData<any>(collection(firestoreg, 'courses'));
        })
      )
      .subscribe((res) => {
        console.log(res);
      });
  }

  login() {
    signInWithPopup(this.auth, new GoogleAuthProvider()).then(
      (res: UserCredential) => {
        this.user = res.user;
      }
    );
  }

  logout() {
    signOut(this.auth);
  }

  ngOnInit(): void {}
}
