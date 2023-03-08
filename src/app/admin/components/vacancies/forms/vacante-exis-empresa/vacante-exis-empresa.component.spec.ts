import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VacanteExisEmpresaComponent } from './vacante-exis-empresa.component';

describe('VacanteExisEmpresaComponent', () => {
  let component: VacanteExisEmpresaComponent;
  let fixture: ComponentFixture<VacanteExisEmpresaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VacanteExisEmpresaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VacanteExisEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
