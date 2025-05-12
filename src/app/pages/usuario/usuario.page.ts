import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { GlobalService } from '../../services/global.service'; // Asegúrate de que la ruta sea correcta

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
  const usuario = this.globalService.getUserType(); // Obtén el tipo de usuario actual
  if (!usuario) {
    console.error('Usuario no autenticado');
    return;
  }

  this.globalService
    .crearSolicitud(linea.Tutor, usuario, linea.Titulo)
    .then(() => {
      console.log('Solicitud creada con éxito');
      alert('Solicitud enviada con éxito');
    })
    .catch((error) => {
      console.error('Error al crear la solicitud:', error);
      alert('Error al enviar la solicitud');
    });
}
}