import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader,IonButtons,IonMenuButton,IonList, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonItem, IonLabel } from '@ionic/angular/standalone';
import { GlobalService } from '../../services/global.service';
import { collection, getDocs, query, where } from 'firebase/firestore';

@Component({
  selector: 'app-tutor-calificacion',
  templateUrl: './tutor-calificacion.page.html',
  styleUrls: ['./tutor-calificacion.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonButtons,
    IonList,
    IonMenuButton,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonItem,
    IonLabel,
  ],
})
export class TutorCalificacionPage implements OnInit {
  solicitudes: any[] = [];
  alumnoSeleccionado: any = null;
  respuestas: number[] = Array(8).fill(0);

  constructor(private globalService: GlobalService) {}

  async ngOnInit() {
    await this.cargarSolicitudesAsignadas();
  }

 async cargarSolicitudesAsignadas() {
  const tutorEmail = await this.globalService.getUserEmail();
  if (!tutorEmail) return;
  this.solicitudes = await this.globalService.obtenerSolicitudesAsignadasTutor(tutorEmail);
}

  seleccionarAlumno(solicitud: any) {
    this.alumnoSeleccionado = solicitud;
    this.respuestas = Array(8).fill(0);
  }

  async enviarCalificacion() {
    // Media ponderada: 7 preguntas al 10%, la 6ª al 30%
    const media =
      (this.respuestas[0] + this.respuestas[1] + this.respuestas[2] + this.respuestas[3] +
        this.respuestas[4] + this.respuestas[6] + this.respuestas[7]) * 0.1 +
      this.respuestas[5] * 0.3;
    try {
      await this.globalService.guardarCalificacionEnEntrega(this.alumnoSeleccionado.alumnoId, 'tutor', media);
      alert('Calificación enviada');
      this.alumnoSeleccionado = null;
    } catch (error) {
      console.error('Error al guardar la calificación:', error);
    }
  }
}