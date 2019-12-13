import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualCostComponent } from './actual-cost.component';

describe('ActualCostComponent', () => {
  let component: ActualCostComponent;
  let fixture: ComponentFixture<ActualCostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActualCostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActualCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
