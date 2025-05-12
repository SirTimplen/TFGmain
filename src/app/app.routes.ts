import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login.page';
import { UsuarioPage } from './pages/usuario/usuario.page';
import { TutorPage } from './pages/tutor/tutor.page';
import { TribunalPage } from './pages/tribunal/tribunal.page';
import { SolicitudesPage } from './pages/solicitudes/solicitudes.page';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPage },
  { path: 'usuario', component: UsuarioPage },
  { path: 'pages/usuario', component: UsuarioPage },
  { path: 'pages/tutor', component: TutorPage },
  { path: 'pages/tribunal', component: TribunalPage },
  { path: 'tutor', component: TutorPage },
  { path: 'tribunal', component: TribunalPage },
  { path: 'pages/solicitudes', component: SolicitudesPage },
];