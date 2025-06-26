import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login.page';
import { UsuarioPage } from './pages/usuario/usuario.page';
import { TutorPage } from './pages/tutor/tutor.page';
import { TribunalPage } from './pages/tribunal/tribunal.page';
import { SolicitudesPage } from './pages/solicitudes/solicitudes.page';
import { SolicitudesTutorPage } from './pages/solicitudesTutor/solicitudesTutor.page';
import { AsignacionesPage } from './pages/asignaciones/asignaciones.page';
import { AuthGuard } from './guards/auth.guard';
import { LoggedInGuard } from './guards/logged-in.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'usuario',
    loadComponent: () => import('./pages/usuario/usuario.page').then(m => m.UsuarioPage),
    canActivate: [LoggedInGuard]
  },
  { path: 'pages/usuario', component: UsuarioPage },
  {
    path: 'pages/tutor',
    loadComponent: () => import('./pages/tutor/tutor.page').then(m => m.TutorPage),
    canActivate: [LoggedInGuard]
  },
  {
    path: 'pages/tribunal',
    loadComponent: () => import('./pages/tribunal/tribunal.page').then(m => m.TribunalPage),
    canActivate: [LoggedInGuard]
  },
  {
    path: 'tutor',
    loadComponent: () => import('./pages/tutor/tutor.page').then(m => m.TutorPage),
    canActivate: [LoggedInGuard]
  },
  {
    path: 'tribunal',
    loadComponent: () => import('./pages/tribunal/tribunal.page').then(m => m.TribunalPage),
    canActivate: [LoggedInGuard]
  },
  {
    path: 'pages/solicitudes',
    loadComponent: () => import('./pages/solicitudes/solicitudes.page').then(m => m.SolicitudesPage),
    canActivate: [LoggedInGuard]
  },
  {
    path: 'pages/solicitudesTutor',
    loadComponent: () => import('./pages/solicitudesTutor/solicitudesTutor.page').then(m => m.SolicitudesTutorPage),
    canActivate: [LoggedInGuard]
  },
  { path: 'pages/asignaciones', component: AsignacionesPage }, // Añade esta línea
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.page').then( m => m.AdminPage),
    canActivate: [LoggedInGuard]
  },
  {
    path: 'admin-asignaciones',
    loadComponent: () => import('./pages/admin-asignaciones/admin-asignaciones.page').then( m => m.AdminAsignacionesPage),
    canActivate: [LoggedInGuard]
  },
  {
    path: 'asignaciones',
    loadComponent: () => import('./pages/asignaciones/asignaciones.page').then( m => m.AsignacionesPage),
    canActivate: [LoggedInGuard]
  },
  {
    path: 'tribunal-admin',
    loadComponent: () => import('./pages/tribunal-admin/tribunal-admin.page').then( m => m.TribunalAdminPage),
    canActivate: [LoggedInGuard]
  },
  {
    path: 'usuario-tribunal',
    loadComponent: () => import('./pages/usuario-tribunal/usuario-tribunal.page').then( m => m.UsuarioTribunalPage)
    ,
    canActivate: [LoggedInGuard]
  },
  {
    path: 'tutor-calificacion',
    loadComponent: () => import('./pages/tutor-calificacion/tutor-calificacion.page').then( m => m.TutorCalificacionPage),
    canActivate: [LoggedInGuard]
  },
  {
    path: '**',
    redirectTo: 'login'
  },
  
  
];