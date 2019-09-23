import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RActivityLogEComponent } from './r-activity-log-e.component';

describe('RActivityLogEComponent', () => {
  let component: RActivityLogEComponent;
  let fixture: ComponentFixture<RActivityLogEComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RActivityLogEComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RActivityLogEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
