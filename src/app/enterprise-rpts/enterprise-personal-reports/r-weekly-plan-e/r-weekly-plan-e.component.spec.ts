import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RWeeklyPlanEComponent } from './r-weekly-plan-e.component';

describe('RWeeklyPlanEComponent', () => {
  let component: RWeeklyPlanEComponent;
  let fixture: ComponentFixture<RWeeklyPlanEComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RWeeklyPlanEComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RWeeklyPlanEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
