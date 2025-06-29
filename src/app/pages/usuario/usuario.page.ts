import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader,IonLabel,IonItem,IonSelect,IonSelectOption, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from '@ionic/angular/standalone';
import { GlobalService } from '../../services/global.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonItem,
    IonSelect,
    IonLabel,
    FormsModule,
    IonSelectOption,
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
  public lineasFiltradas: any[] = [];
  filtroTutor: string = '';
  filtroAmbito: string = '';
  tutoresUnicos: string[] = [];
  ambitosUnicos: string[] = [];

  constructor(private globalService: GlobalService) {}

 async ngOnInit() {
    try {
      this.lineasTFG = await this.globalService.obtenerLineas();
      this.tutoresUnicos = [...new Set(this.lineasTFG.map(l => l.tutor))];
      this.ambitosUnicos = [...new Set(this.lineasTFG.map(l => l.ambito))];
      this.aplicarFiltros();
    } catch (error) {
      console.error('Error al cargar las líneas:', error);
    }
  }

  aplicarFiltros() {
    this.lineasFiltradas = this.lineasTFG.filter(linea =>
      (!this.filtroTutor || linea.tutor === this.filtroTutor) &&
      (!this.filtroAmbito || linea.ambito === this.filtroAmbito)
    );
  }
  onFiltroTutorChange() {
    this.aplicarFiltros();
  }

  onFiltroAmbitoChange() {
    this.aplicarFiltros();
  }

  solicitarLinea(linea: any) {
    if (linea.plazasLibres <= 0) {
      alert('No hay plazas disponibles para esta línea');
      return;
    }
    this.globalService
      .crearSolicitud(linea.tutor, linea.id)
      .then(() => {
        alert('Solicitud enviada con éxito');
      })
      .catch((error) => {
        alert(error.message || 'Error al enviar la solicitud');
      });
  }


}