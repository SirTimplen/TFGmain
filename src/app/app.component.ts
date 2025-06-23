import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { IonApp, IonToolbar, IonButtons,IonNote, IonMenuButton, IonHeader, IonMenu, IonContent, IonTitle, IonList, IonListHeader, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, heartOutline, heartSharp, warningOutline, warningSharp } from 'ionicons/icons';
import { GlobalService } from './services/global.service';
import { Router } from '@angular/router';
interface MenuPage {
  title: string;
  url: string;
  icon: string;
}
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [
    CommonModule, // Agrega CommonModule para habilitar *ngFor
    RouterLink,
    RouterLinkActive,
    IonApp,
    IonNote,
    IonHeader,
    IonButtons,
    IonToolbar,
    IonMenuButton,
    IonMenu,
    IonContent,
    IonTitle,
    IonList,
    IonListHeader,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel,
    IonRouterLink,
    IonRouterOutlet,
  ],
})
export class AppComponent implements OnInit{
  public userType: 'usuario' | 'tutor' |'admin' | null = null;
  
  public menus: { [key: string]: MenuPage[] } = {
  usuario: [
    { title: 'Lineas de TFG', url: '/pages/usuario', icon: 'mail' },
    { title: 'Mis Solicitudes', url: '/pages/solicitudes', icon: 'list' },
    { title: 'Asignaciones', url: '/pages/asignaciones', icon: 'list' },
    { title: 'Defensa del TFG', url: '/usuario-tribunal', icon: 'warning' },
  ],
  tutor: [
    { title: 'Mis Líneas de TFG', url: '/tutor', icon: 'mail' }, // Asegúrate de que la URL sea correcta
    { title: 'Solicitudes', url: '/pages/solicitudesTutor', icon: 'paper-plane' },
    { title: 'Asignaciones', url: '/pages/asignaciones', icon: 'list' },
    { title: 'Tribunales', url: '/pages/tribunal', icon: 'warning' },
  ],
  tribunal: [
    { title: 'Mis Líneas de TFG', url: '/tutor', icon: 'mail' }, // Asegúrate de que la URL sea correcta
    { title: 'Solicitudes', url: '/pages/solicitudesTutor', icon: 'paper-plane' },
    { title: 'Asignaciones', url: '/pages/asignaciones', icon: 'list' },
  ],
  admin: [
      { title: 'Administrar Líneas', url: '/admin', icon: 'settings' },
      {title: 'Asignaciones', url: '/admin-asignaciones', icon: 'list' },
      {title: 'Tribunales', url: '/tribunal-admin', icon: 'warning' },
      // Puedes añadir más opciones si lo deseas
    ],
};

constructor(public globalService: GlobalService, private router: Router) {this.globalService.userType$.subscribe(userType => {
    if (userType) {
      this.userType = userType;
    } else {
      this.userType = null;
    }
  });}
  
  ngOnInit() {
  const userType = localStorage.getItem('userType') as 'usuario' | 'tutor' | 'admin' | null;
  if (userType) {
    this.userType = userType;
    this.globalService.setUserType(userType);
  }
}

  logout() {
    this.globalService.logout();
    this.userType = null;
    this.router.navigate(['/login']);
  }

  // Método para obtener las páginas del menú según el tipo de usuario
  get appPages(): MenuPage[] {
  return this.userType && this.menus[this.userType] ? this.menus[this.userType] : [];
}
}