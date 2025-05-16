import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-admin-asignaciones',
  templateUrl: './admin-asignaciones.page.html',
  styleUrls: ['./admin-asignaciones.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class AdminAsignacionesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
