import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RTimeSpentEComponent } from './r-time-spent-e.component';

describe('RTimeSpentEComponent', () => {
  let component: RTimeSpentEComponent;
  let fixture: ComponentFixture<RTimeSpentEComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RTimeSpentEComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RTimeSpentEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
