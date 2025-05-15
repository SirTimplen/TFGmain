import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LineaFormComponent } from '../../components/linea-form/linea-form.component';
import { ModalController } from '@ionic/angular';
import { GlobalService } from '../../services/global.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-tutor',
  templateUrl: './tutor.page.html',
  styleUrls: ['./tutor.page.scss'],
  standalone: true,
  imports: [
    IonicModule, // Importa todos los componentes de Ionic desde aquí
    CommonModule,
    FormsModule,
    LineaFormComponent,
  ],
})
export class TutorPage implements OnInit {
  public lineasTFG: any[] = [];

  constructor(private modalController: ModalController, private globalService: GlobalService) {}

  async ngOnInit() {
  try {
    const tutorEmail = await this.globalService.getUserEmail(); // Obtén el correo del tutor autenticado
    if (!tutorEmail) {
      console.error('No se pudo obtener el correo del tutor');
      return;
    }

    this.lineasTFG = await this.globalService.obtenerLineasPorTutor(tutorEmail); // Filtra las líneas por el correo del tutor
    console.log('Líneas obtenidas:', this.lineasTFG);
  } catch (error) {
    console.error('Error al cargar las líneas:', error);
  }
}
async crearLinea() {
  const modal = await this.modalController.create({
    component: LineaFormComponent,
  });

  modal.onDidDismiss().then(async (result) => {
    if (result.data) {
      const tutorEmail = await this.globalService.getUserEmail();
      if (tutorEmail) {
        result.data.plazasOriginal = result.data.plazasLibres; // Asigna el valor de plazasOriginal
        await this.globalService.crearLinea(result.data, tutorEmail);
        this.lineasTFG.push(result.data);
      } else {
        console.error('No se pudo obtener el correo del tutor');
      }
    }
  });

  await modal.present();
}

  async editarLinea(linea: any) {
    const modal = await this.modalController.create({
      component: LineaFormComponent,
      componentProps: { linea: { ...linea }, isEdit: true },
    });

    modal.onDidDismiss().then(async (result) => {
      if (result.data) {
        const index = this.lineasTFG.findIndex((l) => l === linea);
        if (index > -1) {
          this.lineasTFG[index] = result.data;
          await this.globalService.actualizarLinea(linea.id, result.data);
        }
      }
    });

    await modal.present();
  }
}