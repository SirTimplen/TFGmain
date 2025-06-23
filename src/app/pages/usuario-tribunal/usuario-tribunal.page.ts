import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader,IonText,IonItem,IonLabel, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from '@ionic/angular/standalone';
import { GlobalService } from '../../services/global.service';

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
      this.tribunal = tribunales.find(t => t.alumnosID.includes(userId));

      if (!this.tribunal) {
        console.log('El usuario no está asignado a ningún tribunal');
      }
    } catch (error) {
      console.error('Error al cargar el tribunal:', error);
    }
  }
  subiendo: boolean = false;
mensaje: string = '';

async onFileSelected(event: any) {
  const archivo: File = event.target.files[0];
  if (!archivo || !this.tribunal?.id) return;
  this.subiendo = true;
  this.mensaje = '';
  try {
    await this.globalService.subirEntregaTFG(archivo, this.tribunal.id);
    this.mensaje = 'Entrega subida correctamente.';
  } catch (error) {
    this.mensaje = 'Error al subir la entrega.';
    console.error(error);
  }
  this.subiendo = false;
}
async cargarEntrega() {
  if (!this.tribunal?.id) return;
  const userEmail = await this.globalService.getUserEmail();
  if (!userEmail) return;
  this.entrega = await this.globalService.obtenerEntregaUsuario(this.tribunal.id, userEmail);
}
async borrarEntrega() {
  if (!this.tribunal?.id || !this.entrega) return;
  const userEmail = await this.globalService.getUserEmail();
  if (!userEmail) return;
  try {
    await this.globalService.borrarEntregaUsuario(this.tribunal.id, userEmail, this.entrega.archivoUrl);
    this.mensaje = 'Entrega borrada correctamente.';
    this.entrega = null;
  } catch (error) {
    this.mensaje = 'Error al borrar la entrega.';
    console.error(error);
  }
}
}