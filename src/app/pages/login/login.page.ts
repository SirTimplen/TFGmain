import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Agregar este esquema
})
export class LoginPage {
  public email: string = '';
  public password: string = '';

  constructor(private router: Router, private globalService: GlobalService) {}

  onLogin() {
    if (this.email === 'usuario@example.com') {
      this.globalService.setUserType('usuario');
      this.router.navigate(['/usuario']);
    } else if (this.email === 'tutor@example.com') {
      this.globalService.setUserType('tutor');
      this.router.navigate(['/tutor']);
    } else if (this.email === 'tribunal@example.com') {
      this.globalService.setUserType('tribunal');
      this.router.navigate(['/tribunal']);
    } else {
      alert('Credenciales incorrectas');
    }
  }
}