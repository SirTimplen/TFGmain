import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonInput } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [ IonButton,IonInput,FormsModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoginPage {
  @ViewChild('emailInput', { static: false }) emailInput!: IonInput; // Referencia al campo de correo

  public email: string = '';
  public password: string = '';

  constructor(private router: Router, private globalService: GlobalService) {}
  

  ionViewDidEnter() {
  setTimeout(() => {
    if (this.emailInput) {
      this.emailInput.setFocus().catch((err) => console.error('Error al enfocar el campo:', err));
    } else {
      console.error('emailInput no está definido.');
    }
  }, 3000); // 3 segundos
}

  onInputChange(event: any, field: string) {
    const value = event.target.value;
    if (field === 'email') {
      this.email = value;
    } else if (field === 'password') {
      this.password = value;
    }
  }

  async onLogin(event: Event) {
    event.preventDefault(); // Previene el comportamiento por defecto del formulario

    try {
      const userType = await this.globalService.login(this.email, this.password);
      this.router.navigate(['/' + userType]);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  }
}