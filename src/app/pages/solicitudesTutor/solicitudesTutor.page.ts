import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import {IonicModule} from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-solicitudes-tutor',
  templateUrl: './solicitudesTutor.page.html',
  styleUrls: ['./solicitudesTutor.page.scss'],
  imports: [IonicModule, CommonModule, RouterModule],
  standalone: true,
})
export class SolicitudesTutorPage implements OnInit {
  public solicitudes: any[] = [];

  constructor(private globalService: GlobalService) {}

  async ngOnInit() {
    try {
      const tutorEmail = await this.globalService.getUserEmail();
      if (!tutorEmail) {
        console.error('No se pudo obtener el correo del tutor');
        return;
      }

      this.solicitudes = await this.globalService.obtenerSolicitudesPorTutor(tutorEmail);
    } catch (error) {
      console.error('Error al cargar las solicitudes:', error);
    }
  }

  async aceptarSolicitud(solicitud: any) {
    try {
      await this.globalService.actualizarEstadoSolicitud(solicitud.id, 'Aceptada');
      solicitud.estado = 'Aceptada';
    } catch (error) {
      console.error('Error al aceptar la solicitud:', error);
    }
  }

  async rechazarSolicitud(solicitud: any) {
    try {
      await this.globalService.actualizarEstadoSolicitud(solicitud.id, 'Rechazada');
      solicitud.estado = 'Rechazada';
    } catch (error) {
      console.error('Error al rechazar la solicitud:', error);
    }
  }
}