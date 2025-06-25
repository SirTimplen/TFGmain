import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader,IonText,IonItem,IonLabel, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from '@ionic/angular/standalone';
import { GlobalService } from '../../services/global.service';
import { collection, getDocs } from 'firebase/firestore';

@Component({
  selector: 'app-usuario-tribunal',
  templateUrl: './usuario-tribunal.page.html',
  styleUrls: ['./usuario-tribunal.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonText,
    IonItem,
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
  ],
})
export class UsuarioTribunalPage implements OnInit {
  tribunal: any = null;
  entrega: any = null;
  defensa: any = null;

  constructor(private globalService: GlobalService) { }

  async ngOnInit() {
    await this.cargarTribunal();
    await this.cargarEntrega();

  }

  async cargarTribunal() {
    try {
    const userId = await this.globalService.getUserId();
    if (!userId) {
      console.error('No se pudo obtener el ID del usuario');
      return;
    }
    const tribunales = await this.globalService.obtenerTribunales();
    // Busca el tribunal donde el alumno tiene una defensa
    for (const tribunal of tribunales) {
      // Busca defensa en la subcolección defensas
      const defensasRef = collection(this.globalService['db'], `${this.globalService['pathTribunales']}/${tribunal.id}/defensas`);
      const snapshot = await getDocs(defensasRef);
      const defensaDoc = snapshot.docs.find(doc => doc.data()['alumno'] === userId);
      if (defensaDoc) {
        this.tribunal = tribunal;
        this.defensa = { id: defensaDoc.id, ...defensaDoc.data() };
        break;
      }
    }
    if (!this.tribunal) {
      console.log('El usuario no está asignado a ningún tribunal');
    }
  } catch (error) {
    console.error('Error al cargar el tribunal y defensa:', error);
  }
  }
  subiendo: boolean = false;
mensaje: string = '';

async onFileSelected(event: any) {
  const archivo: File = event.target.files[0];
  if (!archivo) return;
  this.subiendo = true;
  this.mensaje = '';
  try {
    await this.globalService.subirEntregaTFG(archivo);
    this.mensaje = 'Entrega subida correctamente.';
    await this.cargarEntrega();
  } catch (error) {
    this.mensaje = 'Error al subir la entrega.';
    console.error(error);
  }
  this.subiendo = false;
}

async cargarEntrega() {
  this.entrega = await this.globalService.obtenerEntregaUsuario();
}

async borrarEntrega() {
  if (!this.entrega) return;
  try {
    await this.globalService.borrarEntregaUsuario(this.entrega);
    this.mensaje = 'Entrega borrada correctamente.';
    this.entrega = null;
  } catch (error) {
    this.mensaje = 'Error al borrar la entrega.';
    console.error(error);
  }
}
}