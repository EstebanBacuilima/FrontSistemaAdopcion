import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelSeguimientoAdminComponent } from './panel-seguimiento-admin.component';

describe('PanelSeguimientoAdminComponent', () => {
  let component: PanelSeguimientoAdminComponent;
  let fixture: ComponentFixture<PanelSeguimientoAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelSeguimientoAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelSeguimientoAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
