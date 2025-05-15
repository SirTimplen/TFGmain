import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudesTutorPage } from './solicitudesTutor.page';

describe('SolicitudesPage', () => {
  let component: SolicitudesTutorPage;
  let fixture: ComponentFixture<SolicitudesTutorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudesTutorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
