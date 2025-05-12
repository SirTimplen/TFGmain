import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AppComponent } from '../../app.component'; // Importa AppComponent
import { GlobalService } from '../../services/global.service'; // Asegúrate de que la ruta sea correcta

interface MenuPage {
  title: string;
  url: string;
  icon: string;
}

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.page.html',
  styleUrls: ['./solicitudes.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
})
export class SolicitudesPage implements OnInit {
  public solicitudes: any[] = []; // Cambia el tipo según tu necesidad

  public appPages: MenuPage[] = []; // Define el tipo explícito

  constructor(private appComponent: AppComponent,private globalService: GlobalService) {} // Inyecta AppComponent

  ngOnInit() {
  const usuario = this.appComponent.userType; // Obtén el correo del usuario autenticado
  if (!usuario) {
    console.error('Usuario no autenticado');
    return;
  }

  this.globalService
    .obtenerSolicitudes(usuario)
    .then((solicitudes) => {
      this.solicitudes = solicitudes;
    })
    .catch((error) => {
      console.error('Error al cargar las solicitudes:', error);
    });
}
}