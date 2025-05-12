import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AppComponent } from '../../app.component'; // Importa AppComponent

interface MenuPage {
  title: string;
  url: string;
  icon: string;
}

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.page.html',
  styleUrls: ['./solicitudes.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
})
export class SolicitudesPage implements OnInit {
  public solicitudes = [
    { titulo: 'Desarrollo de una aplicación móvil', estado: 'Aceptada' },
    { titulo: 'Análisis de datos con Machine Learning', estado: 'Pendiente' },
    { titulo: 'Diseño de sistemas embebidos', estado: 'Rechazada' },
  ];

  public appPages: MenuPage[] = []; // Define el tipo explícito

  constructor(private appComponent: AppComponent) {} // Inyecta AppComponent

  ngOnInit() {
    // Obtén las páginas del menú desde AppComponent
    this.appPages = this.appComponent.appPages;
  }
}