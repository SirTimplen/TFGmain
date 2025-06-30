import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from '@ionic/angular/standalone';
import { GlobalService } from '../../services/global.service';
import {IonSelect,IonSelectOption, IonLabel,IonItem,IonInput } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
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
      IonSelect,
      IonSelectOption,
      IonLabel,
      IonItem,
      IonInput,
      FormsModule,
    ]
    ,})
export class AdminAsignacionesPage implements OnInit {

  public solicitudesAceptadas: any[] = [];
  public solicitudesFiltradas: any[] = [];
  public searchTerm: string = '';
  public filtroTutor: string = '';
  public tutoresUnicos: string[] = [];

  constructor(private globalService: GlobalService) { }

  async ngOnInit() {
    try {
      this.solicitudesAceptadas = await this.globalService.obtenerSolicitudesAceptadas();
      this.tutoresUnicos = [...new Set(this.solicitudesAceptadas.map(s => s.tutor).filter(Boolean))];

      this.aplicarFiltro();

    } catch (error) {
      console.error('Error al cargar las solicitudes aceptadas:', error);
    }
  }
  aplicarFiltro() {
    const term = this.searchTerm.trim().toLowerCase();
    this.solicitudesFiltradas = this.solicitudesAceptadas.filter(s =>
      (!term || (s.usuario && s.usuario.toLowerCase().includes(term))) &&
      (!this.filtroTutor || s.tutor === this.filtroTutor)
    );
  }
  async asignarSolicitud(solicitud: any) {
    try {
      // Logic to assign the request definitively
      solicitud.asignacion = true;
      await this.globalService.actualizarSolicitud(solicitud.id, { asignacion: true });
      console.log('Solicitud asignada definitivamente');
    } catch (error) {
      console.error('Error al asignar la solicitud:', error);
    }
  }

  async desasignarSolicitud(solicitud: any) {
    try {
      // Logic to unassign the request
      solicitud.asignacion = false;
      await this.globalService.actualizarSolicitud(solicitud.id, { asignacion: false });
      console.log('Solicitud desasignada');
    } catch (error) {
      console.error('Error al desasignar la solicitud:', error);
    }
  }

  async cancelarSolicitud(solicitud: any) {
    try {
      await this.globalService.cancelarSolicitud(solicitud.id);
      this.solicitudesAceptadas = this.solicitudesAceptadas.filter(s => s.id !== solicitud.id);
      console.log('Solicitud cancelada');
    } catch (error) {
      console.error('Error al cancelar la solicitud:', error);
    }
  }

  async asignarTodas() {
    try {
      for (const solicitud of this.solicitudesAceptadas) {
        if (!solicitud.asignacion) {
          await this.asignarSolicitud(solicitud);
        }
      }
      console.log('Todas las solicitudes asignadas');
    } catch (error) {
      console.error('Error al asignar todas las solicitudes:', error);
    }
  }

  async desasignarTodas() {
    try {
      for (const solicitud of this.solicitudesAceptadas) {
        if (solicitud.asignacion) {
          await this.desasignarSolicitud(solicitud);
        }
      }
      console.log('Todas las solicitudes desasignadas');
    } catch (error) {
      console.error('Error al desasignar todas las solicitudes:', error);
    }
  }
}