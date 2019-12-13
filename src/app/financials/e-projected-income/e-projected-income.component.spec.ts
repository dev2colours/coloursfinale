import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EProjectedIncomeComponent } from './e-projected-income.component';

describe('EProjectedIncomeComponent', () => {
  let component: EProjectedIncomeComponent;
  let fixture: ComponentFixture<EProjectedIncomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EProjectedIncomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EProjectedIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
