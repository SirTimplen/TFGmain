import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader,IonList,IonText,IonItem,IonLabel, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from '@ionic/angular/standalone';
import { GlobalService } from '../../services/global.service';
@Component({
  selector: 'app-tribunal',
  templateUrl: './tribunal.page.html',
  styleUrls: ['./tribunal.page.scss'],
  standalone: true,
imports: [
    CommonModule,
    IonText,
    IonItem,
    IonList,
    IonLabel,
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
  ],})
export class TribunalPage implements OnInit {

  constructor(private globalService: GlobalService) { }
tribunales: any[] = [];
defensas: any[] = [];
tribunalSeleccionadoId: string | null = null;
defensaSeleccionadaId: string | null = null;
preguntas: string[] = [
  'Pregunta 1', 'Pregunta 2', 'Pregunta 3', 'Pregunta 4',
  'Pregunta 5', 'Pregunta 6', 'Pregunta 7'
];
respuestas: number[] = Array(this.preguntas.length).fill(0);

async ngOnInit() {
  await this.cargarTribunales();
}

async cargarTribunales() {
  const userId = await this.globalService.getTutorId();
  if (userId) {
    this.tribunales = await this.globalService.obtenerTribunalesPorTutor(userId);
  } else {
    this.tribunales = [];
    console.error('No se pudo obtener el ID de usuario.');
  }
}

async toggleDefensas(tribunalId: string) {
  if (this.tribunalSeleccionadoId === tribunalId) {
    this.tribunalSeleccionadoId = null;
    this.defensas = [];
    this.defensaSeleccionadaId = null;
    return;
  }
  this.tribunalSeleccionadoId = tribunalId;
  // Carga defensas y nombres de alumnos
  this.defensas = await this.globalService.obtenerDefensasConNombres(tribunalId);
  this.defensaSeleccionadaId = null;
}

toggleCalificar(defensaId: string) {
  this.defensaSeleccionadaId = this.defensaSeleccionadaId === defensaId ? null : defensaId;
}

async enviarCalificacion() {
  const media = (
    (this.respuestas[0] + this.respuestas[1] + this.respuestas[2] + this.respuestas[3]) * 0.1 +
    (this.respuestas[4] + this.respuestas[5] + this.respuestas[6]) * 0.2
  );
  try {
    const defensa = this.defensas.find(d => d.id === this.defensaSeleccionadaId);
    if (!defensa) return;
    // Determina el puesto del usuario en el tribunal
    const userId = await this.globalService.getTutorId();
    if (!userId) {
      console.error('No se pudo obtener el ID del usuario.');
      return;
    }
    const userName = await this.globalService.obtenerNombreProfesor(userId);
    const tribunal = this.tribunales.find(t => t.id === this.tribunalSeleccionadoId);
    let puesto = '';
    if (tribunal.presidente === userName) puesto = 'presidente';
    else if (tribunal.secretario === userName) puesto = 'secretario';
    else if (tribunal.vocal === userName) puesto = 'vocal';
    else if (tribunal.suplente === userName) puesto = 'suplente';
    else puesto = 'tutor'; // O ajusta según tu lógica

    await this.globalService.guardarCalificacionEnEntrega(defensa.alumnoId, puesto, media);
    this.respuestas.fill(0);
    this.defensaSeleccionadaId = null;
  } catch (error) {
    console.error('Error al guardar la calificación:', error);
  }
}
}
