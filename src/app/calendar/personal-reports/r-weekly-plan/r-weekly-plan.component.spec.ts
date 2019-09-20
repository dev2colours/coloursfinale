import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RWeeklyPlanComponent } from './r-weekly-plan.component';

describe('RWeeklyPlanComponent', () => {
  let component: RWeeklyPlanComponent;
  let fixture: ComponentFixture<RWeeklyPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RWeeklyPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RWeeklyPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
