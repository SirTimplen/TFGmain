import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent,IonList,IonListHeader,IonLabel,IonItem, IonMenuButton, IonButton, IonButtons, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { LineaFormComponent } from '../../components/linea-form/linea-form.component';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-tutor',
  templateUrl: './tutor.page.html',
  styleUrls: ['./tutor.page.scss'],
  standalone: true,
  imports: [IonContent,IonItem,IonList,LineaFormComponent,IonListHeader, IonMenuButton,IonLabel, IonButton, IonButtons, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule],
})
export class TutorPage implements OnInit {
  public lineasTFG = [
    {
      titulo: 'Desarrollo de una aplicación móvil',
      ambito: 'Ingeniería de Software',
      descripcion: 'Crear una aplicación móvil para la gestión de tareas.',
      plazasLibres: 2,
    },
    {
      titulo: 'Análisis de datos con Machine Learning',
      ambito: 'Inteligencia Artificial',
      descripcion: 'Aplicar técnicas de Machine Learning para analizar datos.',
      plazasLibres: 1,
    },
  ];

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  async editarLinea(linea: any) {
    const modal = await this.modalController.create({
      component: LineaFormComponent,
      componentProps: { linea: { ...linea }, isEdit: true },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        const index = this.lineasTFG.findIndex((l) => l === linea);
        if (index > -1) {
          this.lineasTFG[index] = result.data;
        }
      }
    });

    await modal.present();
  }

  async crearLinea() {
    const modal = await this.modalController.create({
      component: LineaFormComponent,
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.lineasTFG.push(result.data);
      }
    });

    await modal.present();
  }

}