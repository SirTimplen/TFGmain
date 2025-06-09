import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms'; // Add FormsModule here

import { RouterModule } from '@angular/router';
import { IonMenu, IonSelect, IonInput, IonHeader, IonDatetime, IonToolbar, IonTitle, IonContent, IonList, IonMenuToggle, IonItem, IonIcon, IonLabel, IonButtons, IonMenuButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonSelectOption } from '@ionic/angular/standalone';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-tribunal-admin',
  templateUrl: './tribunal-admin.page.html',
  styleUrls: ['./tribunal-admin.page.scss'],
  standalone: true,
imports: [
    CommonModule,
    RouterModule,
    FormsModule, // Add FormsModule here
    IonDatetime,
    IonMenu,
    IonInput,
    IonSelect,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel,
    IonButtons,
    IonMenuButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonSelectOption,
  ],})
export class TribunalAdminPage implements OnInit {
  nuevoTribunal: any = {
    alumnos: []
  };
  tribunales: any[] = [];
  profesores: any[] = [];
  alumnos: any[] = []; // Añadimos esta línea para almacenar la lista de alumnos
  mostrarFormulario: boolean = false;

  constructor(private globalService: GlobalService) {}

  ngOnInit() {
    this.cargarTribunales();
    this.cargarProfesores();
    this.cargarAlumnos(); // Añadimos esta línea para cargar los alumnos al iniciar
  }

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  async cargarTribunales() {
    this.tribunales = await this.globalService.obtenerTribunales();
  }

  async cargarProfesores() {
    this.profesores = await this.globalService.obtenerProfesores();
  }

  async cargarAlumnos() {
    this.alumnos = await this.globalService.obtenerAlumnos(); // Asumimos que existe este método en GlobalService
  }

  async crearTribunal() {
    try {
      // Aseguramos que los alumnos seleccionados se incluyan en el nuevo tribunal
      await this.globalService.crearTribunal(this.nuevoTribunal);
      this.nuevoTribunal = { alumnos: [] }; // Reseteamos el formulario, manteniendo la estructura
      await this.cargarTribunales();
      this.mostrarFormulario = false;
    } catch (error) {
      console.error('Error al crear el tribunal:', error);
    }
  }

  verDetallesTribunal(tribunalId: string) {
    // Implementar la navegación a una página de detalles del tribunal
    // donde se puedan ver y gestionar las calificaciones y entregas
  }
}