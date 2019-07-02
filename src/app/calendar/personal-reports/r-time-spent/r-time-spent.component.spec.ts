import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RTimeSpentComponent } from './r-time-spent.component';

describe('RTimeSpentComponent', () => {
  let component: RTimeSpentComponent;
  let fixture: ComponentFixture<RTimeSpentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RTimeSpentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RTimeSpentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
