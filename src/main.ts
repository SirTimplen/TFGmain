// filepath: c:\Users\Usuario\Documents\TFG\src\main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

// Importa Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA21bOfc1pWCKyj0Zjwg4vp6RcjBc5Xw_s",
  authDomain: "tfgdetfgs.firebaseapp.com",
  databaseURL: "https://tfgdetfgs-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "tfgdetfgs",
  storageBucket: "tfgdetfgs.firebasestorage.app",
  messagingSenderId: "570821068180",
  appId: "1:570821068180:web:4e8c910a22451880903b81",
  measurementId: "G-PZWFEXG968"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Bootstrap de la aplicación
bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});