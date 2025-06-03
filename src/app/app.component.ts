import { Component,OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { IonApp, IonToolbar, IonButtons, IonMenuButton, IonHeader, IonMenu, IonContent, IonTitle, IonList, IonListHeader, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink } from '@ionic/angular/standalone';
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
  public userType: 'usuario' | 'tutor' | 'tribunal' |'admin' | null = null;
  
  public menus: { [key: string]: MenuPage[] } = {
  usuario: [
    { title: 'Lineas de TFG', url: '/pages/usuario', icon: 'mail' },
    { title: 'Mis Solicitudes', url: '/pages/solicitudes', icon: 'list' },
  ],
  tutor: [
    { title: 'Mis Líneas de TFG', url: '/tutor', icon: 'mail' }, // Asegúrate de que la URL sea correcta
    { title: 'Solicitudes', url: '/pages/solicitudesTutor', icon: 'paper-plane' },
  ],
  tribunal: [
    { title: 'Lineas de TFG', url: '/pages/lineas', icon: 'mail' },
    { title: 'Asignaciones', url: '/pages/outbox', icon: 'paper-plane' },
  ],
  admin: [
      { title: 'Administrar Líneas', url: '/admin', icon: 'settings' },
      {title: 'Asignaciones', url: '/admin-asignaciones', icon: 'list' },
      // Puedes añadir más opciones si lo deseas
    ],
};
constructor(public globalService: GlobalService, private router: Router) {}

  ngOnInit() {
    this.globalService.userType$.subscribe((type) => {
      this.userType = type;
      console.log('UserType updated in AppComponent:', this.userType); // Depuración
    });
  }

  // Método para obtener las páginas del menú según el tipo de usuario
  get appPages(): MenuPage[] {
    return this.userType ? this.menus[this.userType] : [];
  }
}