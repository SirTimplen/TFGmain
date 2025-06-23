import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from '@ionic/angular/standalone';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-usuario-tribunal',
  templateUrl: './usuario-tribunal.page.html',
  styleUrls: ['./usuario-tribunal.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
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

  constructor(private globalService: GlobalService) { }

  async ngOnInit() {
    await this.cargarTribunal();
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
}