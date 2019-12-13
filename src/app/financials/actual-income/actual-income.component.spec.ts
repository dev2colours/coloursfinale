import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualIncomeComponent } from './actual-income.component';

describe('ActualIncomeComponent', () => {
  let component: ActualIncomeComponent;
  let fixture: ComponentFixture<ActualIncomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActualIncomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActualIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
