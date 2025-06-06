import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonicModule} from '@ionic/angular';

@Component({
  selector: 'app-linea-form',
  templateUrl: './linea-form.component.html',
  styleUrls: ['./linea-form.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class LineaFormComponent {
  @Input() linea: any = { titulo: '', ambito: '', descripcion: '', plazasLibres: 0 };
  @Input() isEdit: boolean = false;

  constructor(private modalController: ModalController) {}

  dismiss() {
    this.modalController.dismiss();
  }

  submitForm() {
    this.modalController.dismiss(this.linea);
  }
}