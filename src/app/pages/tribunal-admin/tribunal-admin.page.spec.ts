import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TribunalAdminPage } from './tribunal-admin.page';

describe('TribunalAdminPage', () => {
  let component: TribunalAdminPage;
  let fixture: ComponentFixture<TribunalAdminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TribunalAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
