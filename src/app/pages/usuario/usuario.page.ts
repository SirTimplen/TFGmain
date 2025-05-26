import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from '@ionic/angular/standalone';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
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
export class UsuarioPage implements OnInit {
  public lineasTFG: any[] = [];

  constructor(private globalService: GlobalService) {}

  async ngOnInit() {
    try {
      this.lineasTFG = await this.globalService.obtenerLineas();
      console.log('Líneas obtenidas:', this.lineasTFG);
    } catch (error) {
      console.error('Error al cargar las líneas:', error);
    }
  }

  solicitarLinea(linea: any) {
  if (linea.plazasLibres <= 0) {
    alert('No hay plazas disponibles para esta línea');
    return;
  }

  this.globalService
    .crearSolicitud(linea.tutor, linea.id)
    .then(() => {
      console.log('Solicitud creada con éxito');
      alert('Solicitud enviada con éxito');
    })
    .catch((error) => {
      console.error('Error al crear la solicitud:', error);
      alert(error.message || 'Error al enviar la solicitud');
    });
}
}