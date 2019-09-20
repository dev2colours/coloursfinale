import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RDailyPlanComponent } from './r-daily-plan.component';

describe('RDailyPlanComponent', () => {
  let component: RDailyPlanComponent;
  let fixture: ComponentFixture<RDailyPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RDailyPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RDailyPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
