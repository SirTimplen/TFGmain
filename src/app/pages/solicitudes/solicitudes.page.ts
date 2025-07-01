import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonMenuToggle, IonItem, IonIcon, IonLabel, IonButtons, IonMenuButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.page.html',
  styleUrls: ['./solicitudes.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonMenu,
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
  ],
})
export class SolicitudesPage implements OnInit {
  public solicitudes: any[] = [];
  public appPages: any[] = [];

  constructor(private globalService: GlobalService) {}

  async ngOnInit() {
    this.solicitudes = await this.globalService.obtenerSolicitudes();
  }

  async cancelarSolicitud(solicitud: any) {
  try {
    await this.globalService.borrarSolicitud(solicitud.id);
    this.solicitudes = this.solicitudes.filter(s => s.id !== solicitud.id);
  } catch (error) {
    console.error('Error al cancelar la solicitud:', error);
  }
}
}