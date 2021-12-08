import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// firebase
import { initializeApp } from 'firebase/app';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore } from '@angular/fire/firestore';
import { provideStorage } from '@angular/fire/storage';
import { getStorage } from '@firebase/storage';
import {
  connectFirestoreEmulator,
  enableIndexedDbPersistence,
  getFirestore,
} from 'firebase/firestore';
import { connectAuthEmulator, provideAuth, getAuth } from '@angular/fire/auth';
import { SETTINGS as AUTH_SETTINGS } from '@angular/fire/compat/auth';
import {
  AngularFireAuth,
  AngularFireAuthModule,
} from '@angular/fire/compat/auth';
// components
import { LoginFormComponent } from './components/login-form/login-form.component';
// config
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [LoginFormComponent],
  exports: [LoginFormComponent],
  imports: [
    CommonModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => {
      const firestore = getFirestore();
      return firestore;
    }),
    provideStorage(() => getStorage()),
    provideAuth(() => {
      const auth = getAuth();
      return auth;
    }),
    AngularFireAuthModule,
  ],
  providers: [
    AngularFireAuth,
    {
      provide: AUTH_SETTINGS,
      useValue: { appVerificationDisabledForTesting: true },
    },
  ],
})
export class AuthModule {}
