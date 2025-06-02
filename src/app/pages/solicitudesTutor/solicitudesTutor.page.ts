import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from '@ionic/angular/standalone';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-solicitudes-tutor',
  templateUrl: './solicitudesTutor.page.html',
  styleUrls: ['./solicitudesTutor.page.scss'],
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
  ],
})
export class SolicitudesTutorPage implements OnInit {
  public solicitudes: any[] = [];

  constructor(private globalService: GlobalService) {}

  async ngOnInit() {
    const tutorEmail = await this.globalService.getUserEmail();
    if (!tutorEmail) return;
    this.solicitudes = await this.globalService.obtenerSolicitudesPorTutor(tutorEmail);
  }

  async aceptarSolicitud(solicitud: any) {
    await this.globalService.actualizarEstadoSolicitud(solicitud.id, 'Aceptada');
    solicitud.estado = 'Aceptada pot tutor';
  }

  async rechazarSolicitud(solicitud: any) {
    await this.globalService.actualizarEstadoSolicitud(solicitud.id, 'Rechazada por tutor');
    solicitud.estado = 'Rechazada por tutor';
  }
}