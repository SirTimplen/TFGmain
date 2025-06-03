import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from '@ionic/angular/standalone';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-asignaciones',
  templateUrl: './asignaciones.page.html',
  styleUrls: ['./asignaciones.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
export class AsignacionesPage implements OnInit {
  asignaciones: any[] = [];

  constructor(private globalService: GlobalService) { }

  async ngOnInit() {
    await this.cargarAsignaciones();
  }

  async cargarAsignaciones() {
    try {
      const solicitudes = await this.globalService.obtenerSolicitudesAceptadas();
      this.asignaciones = solicitudes.filter(solicitud => solicitud.asignacion);
    } catch (error) {
      console.error('Error al cargar las asignaciones:', error);
    }
  }
}