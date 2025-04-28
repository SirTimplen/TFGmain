import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
  standalone: true,
  imports: [
    IonicModule, // Importa los componentes de Ionic
    CommonModule, // Importa CommonModule para habilitar directivas como *ngFor y *ngIf
  ],
})
export class UsuarioPage implements OnInit {
  public folder!: string;

  private activatedRoute = inject(ActivatedRoute);

  constructor() {}
  public lineasTFG = [
    {
      titulo: 'Desarrollo de una aplicación móvil',
      tutor: 'Dr. Juan Pérez',
      ambito: 'Ingeniería de Software',
      descripcion: 'Crear una aplicación móvil para la gestión de tareas.',
      plazasLibres: 2,
    },
    {
      titulo: 'Análisis de datos con Machine Learning',
      tutor: 'Dra. Ana López',
      ambito: 'Inteligencia Artificial',
      descripcion: 'Aplicar técnicas de Machine Learning para analizar datos.',
      plazasLibres: 1,
    },
    {
      titulo: 'Diseño de sistemas embebidos',
      tutor: 'Dr. Carlos García',
      ambito: 'Sistemas Embebidos',
      descripcion: 'Diseñar un sistema embebido para IoT.',
      plazasLibres: 3,
    },
  ];

  solicitarLinea(linea: any) {
    alert(`Has solicitado la línea: ${linea.titulo}`);
    // Aquí puedes implementar la lógica para enviar la solicitud al backend
  }
  ngOnInit() {
    this.folder = 'usuario'; // Establece el nombre de la página
  }
}