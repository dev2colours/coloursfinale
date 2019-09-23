import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RDailyPlanEComponent } from './r-daily-plan-e.component';

describe('RDailyPlanEComponent', () => {
  let component: RDailyPlanEComponent;
  let fixture: ComponentFixture<RDailyPlanEComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RDailyPlanEComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RDailyPlanEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
