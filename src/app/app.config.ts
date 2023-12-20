import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideAnimations(),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'ring-of-fire-8972a',
          appId: '1:69772837824:web:7432737ef76f828bc8fe25',
          storageBucket: 'ring-of-fire-8972a.appspot.com',
          apiKey: 'AIzaSyDN5E7dHyGAnymKZcXYFXwJ7poC38cQ_XQ',
          authDomain: 'ring-of-fire-8972a.firebaseapp.com',
          messagingSenderId: '69772837824',
        })
      )
    ),
    importProvidersFrom(provideFirestore(() => getFirestore())),
  ],
};
