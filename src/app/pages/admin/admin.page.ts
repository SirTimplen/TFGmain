import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular/standalone';
import { GlobalService } from '../../services/global.service';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonButton, IonInput, IonTextarea } from '@ionic/angular/standalone';

@Component({
  selector: 'tfg-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
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
    IonButton,
    IonInput,
    IonTextarea,
    ],
})
export class AdminPage implements OnInit {
  public lineas: any[] = [];
  public nuevaLinea: any = {
    titulo: '',
    ambito: '',
    descripcion: '',
    plazasLibres: 0,
    plazasOriginal: 0,
    tutor: ''
  };
  public mostrarFormulario: boolean = false; // Añade esta línea


  constructor(
    private globalService: GlobalService,
    private alertCtrl: AlertController
  ) {}

  async ngOnInit() {
    await this.cargarLineas();
  }

  async cargarLineas() {
    this.lineas = await this.globalService.obtenerLineas();
  }

  async crearLinea() {
  if (
    !this.nuevaLinea.titulo ||
    !this.nuevaLinea.ambito ||
    !this.nuevaLinea.descripcion ||
    !this.nuevaLinea.tutor
  ) {
    alert('Todos los campos son obligatorios');
    return;
  }
  // Fuerza los campos a number
  this.nuevaLinea.plazasLibres = Number(this.nuevaLinea.plazasLibres);
  this.nuevaLinea.plazasOriginal = Number(this.nuevaLinea.plazasOriginal ?? this.nuevaLinea.plazasLibres);

  await this.globalService.crearLinea(this.nuevaLinea, this.nuevaLinea.tutor);
  this.nuevaLinea = { titulo: '', ambito: '', descripcion: '', plazasLibres: 0, plazasOriginal: 0, tutor: '' };
  await this.cargarLineas();
}

  async editarLinea(linea: any) {
    const alert = await this.alertCtrl.create({
      header: 'Editar Línea',
      inputs: [
        { name: 'titulo', type: 'text', value: linea.titulo, placeholder: 'Título' },
        { name: 'ambito', type: 'text', value: linea.ambito, placeholder: 'Ámbito' },
        { name: 'descripcion', type: 'text', value: linea.descripcion, placeholder: 'Descripción' },
        { name: 'plazasLibres', type: 'number', value: linea.plazasLibres, placeholder: 'Plazas Libres' },
        { name: 'plazasOriginal', type: 'number', value: linea.plazasOriginal, placeholder: 'Plazas Original' },
        { name: 'tutor', type: 'text', value: linea.tutor, placeholder: 'Tutor' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: async (data) => {
            await this.globalService.actualizarLinea(linea.id, data);
            await this.cargarLineas();
          },
        },
      ],
    });
    await alert.present();
  }

  async borrarLinea(linea: any) {
    if (confirm('¿Seguro que quieres borrar esta línea?')) {
      await this.globalService.borrarLinea(linea.id);
      await this.cargarLineas();
    }
  }

  async resetPlazas(linea: any) {
    await this.globalService.actualizarLinea(linea.id, {
      ...linea,
      plazasLibres: linea.plazasOriginal,
    });
    await this.cargarLineas();
  }

  async resetPlazasTodas() {
    for (const linea of this.lineas) {
      await this.globalService.actualizarLinea(linea.id, {
        ...linea,
        plazasLibres: linea.plazasOriginal,
      });
    }
    await this.cargarLineas();
  }
}