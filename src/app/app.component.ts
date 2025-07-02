import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { IonApp,IonSelect,IonSelectOption, IonToolbar, IonButtons,IonNote, IonMenuButton, IonHeader, IonMenu, IonContent, IonTitle, IonList, IonListHeader, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, heartOutline, heartSharp, warningOutline, warningSharp } from 'ionicons/icons';
import { GlobalService } from './services/global.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
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
    FormsModule,
    IonSelect,
    IonSelectOption,
    RouterLinkActive,
    IonApp,
    IonApp,
    IonNote,
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
    { title: 'Calificación', url: '/tutor-calificacion', icon: 'heart' },
  ],
  admin: [
      { title: 'Administrar Líneas', url: '/admin', icon: 'settings' },
      {title: 'Asignaciones', url: '/admin-asignaciones', icon: 'list' },
      {title: 'Tribunales', url: '/tribunal-admin', icon: 'warning' },
      // Puedes añadir más opciones si lo deseas
    ],
};
carrerasDisponibles=[
    { value: 'ingenieria_informatica', label: 'Ingenieria Informatica' },
    { value: 'enfermeria', label: 'Enfermeria' }
  ];
  convocatoriasDisponibles = [
    { value: 'convocatoria_junio', label: 'Convocatoria Junio' },
    { value: 'convocatoria_julio', label: 'Convocatoria Julio' }
  ];
  selectedCarrera: string = 'ingenieria_informatica';
  selectedConvocatoria: string = 'convocatoria_junio';

constructor(public globalService: GlobalService, private router: Router) {this.globalService.userType$.subscribe(userType => {
    if (userType) {
      this.userType = userType;
    } else {
      this.userType = null;
    }
  });}
  
  async ngOnInit() {
  const userType = localStorage.getItem('userType') as 'usuario' | 'tutor' | 'admin' | null;
  if (userType) {
    this.userType = userType;
    this.globalService.setUserType(userType);
  }
     const storedCarrera = localStorage.getItem('selectedCarrera');
  const storedConvocatoria = localStorage.getItem('selectedConvocatoria');
  if (storedCarrera) {
    this.selectedCarrera = storedCarrera;
    this.globalService.setCarrera(storedCarrera);
  }
  if (storedConvocatoria) {
    this.selectedConvocatoria = storedConvocatoria;
    this.globalService.setConvocatoria(storedConvocatoria);
  }
  }

  logout() {
    this.globalService.logout();
    this.userType = null;
    localStorage.removeItem('userType');
    localStorage.removeItem('selectedCarrera');
    localStorage.removeItem('selectedConvocatoria');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');

    this.router.navigate(['/login']);
  }

  // Método para obtener las páginas del menú según el tipo de usuario
  get appPages(): MenuPage[] {
  return this.userType && this.menus[this.userType] ? this.menus[this.userType] : [];
}


onCarreraChange(event: any) {
  localStorage.setItem('selectedCarrera', this.selectedCarrera);
  this.globalService.setCarrera(this.selectedCarrera);
  //recargar pagina
  window.location.reload();
}

onConvocatoriaChange(event: any) {
  localStorage.setItem('selectedConvocatoria', this.selectedConvocatoria);
  this.globalService.setConvocatoria(this.selectedConvocatoria);
  window.location.reload();

}
}