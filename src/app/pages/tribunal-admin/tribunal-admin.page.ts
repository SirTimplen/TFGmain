import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms'; // Add FormsModule here
import { collection, getDoc, getDocs } from 'firebase/firestore';
import { addDoc, doc, deleteDoc } from 'firebase/firestore';

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
  ],
})
export class TribunalAdminPage implements OnInit {
  nuevoTribunal: any = {
    alumnos: []
  };
  tribunales: any[] = [];
  profesores: any[] = [];
  alumnos: any[] = []; // Añadimos esta línea para almacenar la lista de alumnos
  mostrarFormulario: boolean = false;
  defensas: any[] = [];
  tribunalSeleccionadoId: string | null = null;
  nuevoAlumnoId: string = '';
  nuevaFecha: string = '';
  nuevoLugar: string = '';
  mostrarFormularioDefensa: boolean = false;

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
  // Obtén todos los documentos de entregas
  const entregasRef = collection(this.globalService['db'], this.globalService['pathEntregas']);
  const entregasSnap = await getDocs(entregasRef);
  const idsConEntrega = entregasSnap.docs.map(doc => doc.data()['usuarioId']);

  // Obtén todos los alumnos y filtra solo los que han entregado
  const alumnos = await this.globalService.obtenerAlumnos();
  this.alumnos = await Promise.all(
    alumnos
      .filter(a => idsConEntrega.includes(a.id))
      .map(async a => ({
        id: a.id,
        nombre: a.nombre,
        correo: a.correo
      }))
  );
}

  async crearTribunal() {
    try {
      // Asegúrate de que la fecha esté en el formato correcto antes de enviarla
      if (this.nuevoTribunal.fecha) {
        this.nuevoTribunal.fecha = new Date(this.nuevoTribunal.fecha).toISOString();
      }
      
      // Aseguramos que los alumnos seleccionados se incluyan en el nuevo tribunal
      await this.globalService.crearTribunal(this.nuevoTribunal);
      this.nuevoTribunal = { alumnos: [] }; // Reseteamos el formulario, manteniendo la estructura
      await this.cargarTribunales();
      this.mostrarFormulario = false;
    } catch (error) {
      console.error('Error al crear el tribunal:', error);
    }
  }

  onFechaChange(event: any) {
    // Asegúrate de que la fecha se guarde como una cadena ISO
    this.nuevoTribunal.fecha = new Date(event.detail.value).toISOString();
  }
  getProfesorName(profesorId: string): string {
  const profesor = this.profesores.find(p => p.id === profesorId);
  return profesor ? profesor.correo : 'No asignado';
}

getAlumnoNames(alumnoIds: string[]): string[] {
  return alumnoIds.map(id => {
    const alumno = this.alumnos.find(a => a.id === id);
    return alumno ? alumno.correo : 'No encontrado';
  });
}
async borrarTribunal(tribunalId: string) {
  try {
    await this.globalService.borrarTribunal(tribunalId);
    await this.cargarTribunales();
  } catch (error) {
    console.error('Error al borrar el tribunal:', error);
  }
}
async verDefensas(tribunalId: string) {
  if (this.tribunalSeleccionadoId === tribunalId) {
    // Si ya está seleccionado, oculta las defensas
    this.tribunalSeleccionadoId = null;
    this.defensas = [];
    return;
  }
  this.tribunalSeleccionadoId = tribunalId;
  this.mostrarFormulario = false; // Oculta el formulario de creación si está abierto
  this.mostrarFormularioDefensa = false;
  const defensasRef = collection(this.globalService['db'], `${this.globalService['pathTribunales']}/${tribunalId}/defensas`);
  const snapshot = await getDocs(defensasRef);
  this.defensas = await Promise.all(snapshot.docs.map(async docSnap => {
    const data = docSnap.data();
    // Obtener nombre del alumno
    let alumnoNombre = '';
    if (data['alumno']) {
      const alumnoDoc = await getDoc(doc(this.globalService['db'], 'Usuario', data['alumno']));
      alumnoNombre = alumnoDoc.exists() ? alumnoDoc.data()['Nombre'] : data['alumno'];
    }
    return {
      id: docSnap.id,
      ...data,
      alumno: alumnoNombre
    };
  }));
}

toggleFormularioDefensa() {
  this.mostrarFormularioDefensa = !this.mostrarFormularioDefensa;
}

// Comprobar solapamiento de hora
private haySolapamiento(fecha: string): boolean {
  const nueva = new Date(fecha).getTime();
  return this.defensas.some(defensa => {
    const existente = new Date(defensa.fecha).getTime();
    // 45 minutos = 2700000 ms
    return Math.abs(nueva - existente) < 2700000;
  });
}
async anadirDefensa() {
  if (!this.tribunalSeleccionadoId || !this.nuevoAlumnoId || !this.nuevaFecha || !this.nuevoLugar) return;
  if (this.haySolapamiento(this.nuevaFecha)) {
    alert('La fecha y hora se solapa con otra defensa de este tribunal.');
    return;
  }
  const defensasRef = collection(this.globalService['db'], `${this.globalService['pathTribunales']}/${this.tribunalSeleccionadoId}/defensas`);
  await addDoc(defensasRef, {
    alumno: this.nuevoAlumnoId,
    calificaciones: { presidente: null, secretario: null, vocal: null, tutor: null },
    fecha: this.nuevaFecha,
    lugar: this.nuevoLugar
  });
  await this.verDefensas(this.tribunalSeleccionadoId);
  this.nuevoAlumnoId = '';
  this.nuevaFecha = '';
  this.nuevoLugar = '';
}

async eliminarDefensa(defensaId: string) {
  if (!this.tribunalSeleccionadoId) return;
  const defensaRef = doc(this.globalService['db'], `${this.globalService['pathTribunales']}/${this.tribunalSeleccionadoId}/defensas`, defensaId);
  await deleteDoc(defensaRef);
  await this.verDefensas(this.tribunalSeleccionadoId);
}
}