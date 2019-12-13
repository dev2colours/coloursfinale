import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EActualCostComponent } from './e-actual-cost.component';

describe('EActualCostComponent', () => {
  let component: EActualCostComponent;
  let fixture: ComponentFixture<EActualCostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EActualCostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EActualCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
