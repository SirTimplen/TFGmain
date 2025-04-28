import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common'; // Importa CommonModule para habilitar *ngFor y *ngIf

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
  standalone: true,
  imports: [
    IonicModule, // Importa los componentes de Ionic
    CommonModule, // Importa CommonModule para habilitar directivas como *ngFor y *ngIf
  ],
})
export class FolderPage implements OnInit {
  public folder!: string;
  public tableData = [
    { col1: 'Dato 1', col2: 'Dato 2', col3: 'Dato 3', col4: 'Dato 4', col5: 'Dato 5' },
    { col1: 'Dato A', col2: 'Dato B', col3: 'Dato C', col4: 'Dato D', col5: 'Dato E' },
    { col1: 'Dato X', col2: 'Dato Y', col3: 'Dato Z', col4: 'Dato W', col5: 'Dato V' },
  ];

  private activatedRoute = inject(ActivatedRoute);

  constructor() {}

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;

    // Actualizar los datos de la tabla dinámicamente
    if (this.folder === 'lineas') {
      this.tableData = [
        { col1: 'Dato Actualizado 1', col2: 'Dato Actualizado 2', col3: 'Dato Actualizado 3', col4: 'Dato Actualizado 4', col5: 'Dato Actualizado 5' },
        { col1: 'Dato Actualizado A', col2: 'Dato Actualizado B', col3: 'Dato Actualizado C', col4: 'Dato Actualizado D', col5: 'Dato Actualizado E' },
      ];
    }
  }
}