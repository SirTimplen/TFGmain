import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TribunalPage } from './tribunal.page';

describe('TribunalPage', () => {
  let component: TribunalPage;
  let fixture: ComponentFixture<TribunalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TribunalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
