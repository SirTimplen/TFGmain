import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TutorCalificacionPage } from './tutor-calificacion.page';

describe('TutorCalificacionPage', () => {
  let component: TutorCalificacionPage;
  let fixture: ComponentFixture<TutorCalificacionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorCalificacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
