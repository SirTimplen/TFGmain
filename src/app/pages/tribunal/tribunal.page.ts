import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent,IonMenuButton,IonButton,IonButtons, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tribunal',
  templateUrl: './tribunal.page.html',
  styleUrls: ['./tribunal.page.scss'],
  standalone: true,
  imports: [IonContent,IonMenuButton,IonButton,IonButtons, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class TribunalPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
