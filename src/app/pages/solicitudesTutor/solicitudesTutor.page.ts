import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from '@ionic/angular/standalone';
import { GlobalService } from '../../services/global.service';
import {IonSelect,IonSelectOption, IonLabel,IonItem,IonInput } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';

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
    IonSelect,
    IonSelectOption,
    IonLabel,
    IonItem,
    IonInput,
    FormsModule,
  ],
})
export class SolicitudesTutorPage implements OnInit {
  public solicitudes: any[] = [];
  solicitudesFiltradas: any[] = [];
  searchTerm: string = '';
  constructor(private globalService: GlobalService) {}

  async ngOnInit() {
    const tutorEmail = await this.globalService.getUserEmail();
    if (!tutorEmail) return;
    this.solicitudes = await this.globalService.obtenerSolicitudesPorTutor(tutorEmail);
    this.aplicarFiltro();
  }

  async aceptarSolicitud(solicitud: any) {
    await this.globalService.actualizarEstadoSolicitud(solicitud.id, 'Aceptada');
    solicitud.estado = 'Aceptada pot tutor';
  }

  async rechazarSolicitud(solicitud: any) {
    await this.globalService.actualizarEstadoSolicitud(solicitud.id, 'Rechazada por tutor');
    solicitud.estado = 'Rechazada por tutor';
  }
  aplicarFiltro() {
    const term = this.searchTerm.trim().toLowerCase();
    this.solicitudesFiltradas = this.solicitudes.filter(s =>
      !term || (s.alumnoNombre && s.alumnoNombre.toLowerCase().includes(term))
    );
  }
}