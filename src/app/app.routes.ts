import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login.page';
import { UsuarioPage } from './pages/usuario/usuario.page';
import { TutorPage } from './pages/tutor/tutor.page';
import { TribunalPage } from './pages/tribunal/tribunal.page';
import { SolicitudesPage } from './pages/solicitudes/solicitudes.page';
import { SolicitudesTutorPage } from './pages/solicitudesTutor/solicitudesTutor.page';
import { AsignacionesPage } from './pages/asignaciones/asignaciones.page';

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
  { path: 'pages/solicitudesTutor', component: SolicitudesTutorPage },
  { path: 'pages/asignaciones', component: AsignacionesPage }, // Añade esta línea
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.page').then( m => m.AdminPage)
  },
  {
    path: 'admin-asignaciones',
    loadComponent: () => import('./pages/admin-asignaciones/admin-asignaciones.page').then( m => m.AdminAsignacionesPage)
  },
  {
    path: 'asignaciones',
    loadComponent: () => import('./pages/asignaciones/asignaciones.page').then( m => m.AsignacionesPage)
  },
];
