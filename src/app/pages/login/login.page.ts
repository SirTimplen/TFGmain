import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, IonInput } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [IonicModule, FormsModule, CommonModule],
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
  }, 3000000000000); // 3 segundos
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
    event.preventDefault();
    try {
      const userType = await this.globalService.login(this.email, this.password);

      if (userType === 'usuario') {
        this.router.navigate(['/usuario']);
      } else if (userType === 'tutor') {
        this.router.navigate(['/tutor']);
      } else if (userType === 'tribunal') {
        this.router.navigate(['/tribunal']);
      }
    } catch (error) {
      alert('Error al iniciar sesión: ');
    }
  }
}