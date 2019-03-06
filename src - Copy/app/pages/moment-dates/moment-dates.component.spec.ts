import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MomentDatesComponent } from './moment-dates.component';

describe('MomentDatesComponent', () => {
  let component: MomentDatesComponent;
  let fixture: ComponentFixture<MomentDatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MomentDatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MomentDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
