import { Component,OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { IonApp, IonToolbar, IonButtons, IonMenuButton, IonHeader, IonMenu, IonContent, IonTitle, IonList, IonListHeader, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, heartOutline, heartSharp, warningOutline, warningSharp } from 'ionicons/icons';
import { GlobalService } from './services/global.service';
import { Router } from '@angular/router';

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
  public userType: 'usuario' | 'tutor' | 'tribunal' | null = null;
  
  public menus = {
    usuario:[
      { title: 'Lineas de TFG', url: '/pages/lineas', icon: 'mail' },
      { title: 'Asignaciones', url: '/pages/outbox', icon: 'paper-plane' },
      { title: 'Defensa Pública', url: '/pages/favorites', icon: 'heart' },
      { title: 'Información TFG', url: '/pages/spam', icon: 'warning' },
    ],
    tutor:[
      { title: 'Lineas de TFG', url: '/pages/lineas', icon: 'mail' },
      { title: 'Asignagygyghggciones', url: '/pages/outbox', icon: 'paper-plane' },
      { title: 'Defensa Pública', url: '/pages/favorites', icon: 'heart' },
      { title: 'Información TFG', url: '/pages/spam', icon: 'warning' },
    ],
    tribunal:[
      { title: 'Lineas de TFG', url: '/pages/lineas', icon: 'mail' },
      { title: 'Asignaciones', url: '/pages/outbox', icon: 'paper-plane' },
      { title: 'Defensa Pública', url: '/pages/favorites', icon: 'heart' },
      { title: 'Información TFG', url: '/pages/spam', icon: 'warning' },
    ],
}
constructor(public globalService: GlobalService, private router: Router) {}

  ngOnInit() {
    this.globalService.userType$.subscribe((type) => {
      this.userType = type;
      console.log('UserType updated in AppComponent:', this.userType); // Depuración
    });
  }

  // Método para obtener las páginas del menú según el tipo de usuario
get appPages() {
    return this.userType ? this.menus[this.userType] : [];
  }
}