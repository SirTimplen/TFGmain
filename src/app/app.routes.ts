import { Routes } from '@angular/router';
import { SolicitudesPage } from './pages/solicitudes/solicitudes.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'usuario',
    loadComponent: () =>
      import('./pages/usuario/usuario.page').then((m) => m.UsuarioPage),
  },
  {
    path: 'tutor',
    loadComponent: () =>
      import('./pages/tutor/tutor.page').then((m) => m.TutorPage),
  },
  {
    path: 'tribunal',
    loadComponent: () =>
      import('./pages/tribunal/tribunal.page').then((m) => m.TribunalPage),
  },
  {
    path: 'usuario',
    loadComponent: () =>
      import('./pages/usuario/usuario.page').then((m) => m.UsuarioPage),
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'pages/solicitudes', component: SolicitudesPage },
  
];