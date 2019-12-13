import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EProjectedCostComponent } from './e-projected-cost.component';

describe('EProjectedCostComponent', () => {
  let component: EProjectedCostComponent;
  let fixture: ComponentFixture<EProjectedCostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EProjectedCostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EProjectedCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
