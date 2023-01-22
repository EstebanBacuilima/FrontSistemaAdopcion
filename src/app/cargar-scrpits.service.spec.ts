import { TestBed } from '@angular/core/testing';

import { CargarScrpitsService } from './cargar-scrpits.service';

describe('CargarScrpitsService', () => {
  let service: CargarScrpitsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CargarScrpitsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
