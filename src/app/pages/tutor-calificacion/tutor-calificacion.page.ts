import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tutor-calificacion',
  templateUrl: './tutor-calificacion.page.html',
  styleUrls: ['./tutor-calificacion.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class TutorCalificacionPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
