import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EActualIncomeComponent } from './e-actual-income.component';

describe('EActualIncomeComponent', () => {
  let component: EActualIncomeComponent;
  let fixture: ComponentFixture<EActualIncomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EActualIncomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EActualIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
