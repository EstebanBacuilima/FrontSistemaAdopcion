import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegVoluntarioComponent } from './reg-voluntario.component';

describe('RegVoluntarioComponent', () => {
  let component: RegVoluntarioComponent;
  let fixture: ComponentFixture<RegVoluntarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegVoluntarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegVoluntarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
