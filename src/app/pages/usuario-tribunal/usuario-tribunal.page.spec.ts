import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsuarioTribunalPage } from './usuario-tribunal.page';

describe('UsuarioTribunalPage', () => {
  let component: UsuarioTribunalPage;
  let fixture: ComponentFixture<UsuarioTribunalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioTribunalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
