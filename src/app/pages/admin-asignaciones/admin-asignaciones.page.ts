import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from '@ionic/angular/standalone';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-admin-asignaciones',
  templateUrl: './admin-asignaciones.page.html',
  styleUrls: ['./admin-asignaciones.page.scss'],
  standalone: true,
  imports: [
      CommonModule,
      IonHeader,
      IonToolbar,
      IonButtons,
      IonMenuButton,
      IonTitle,
      IonContent,
      IonCard,
      IonCardHeader,
      IonCardTitle,
      IonCardContent,
      IonButton,
    ]
    ,})
export class AdminAsignacionesPage implements OnInit {

  public solicitudesAceptadas: any[] = [];

  constructor(private globalService: GlobalService) { }

  async ngOnInit() {
    await this.cargarSolicitudesAceptadas();
  }

  async cargarSolicitudesAceptadas() {
    // Load the accepted requests from the service
    this.solicitudesAceptadas = await this.globalService.obtenerSolicitudesAceptadas();
  }

  async asignarSolicitud(solicitud: any) {
    solicitud.asignacion = true;
    await this.globalService.actualizarSolicitud(solicitud.id, solicitud);
    await this.cargarSolicitudesAceptadas();
  }

  async cancelarSolicitud(solicitud: any) {
    // Logic to cancel the request
    await this.globalService.cancelarSolicitud(solicitud.id);
    await this.cargarSolicitudesAceptadas();
  }

  async asignarTodas() {
    for (const solicitud of this.solicitudesAceptadas) {
      solicitud.asignacion = true;
      await this.globalService.actualizarSolicitud(solicitud.id, solicitud);
    }
    await this.cargarSolicitudesAceptadas();
  }

}