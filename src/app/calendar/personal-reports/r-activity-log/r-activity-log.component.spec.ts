import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RActivityLogComponent } from './r-activity-log.component';

describe('RActivityLogComponent', () => {
  let component: RActivityLogComponent;
  let fixture: ComponentFixture<RActivityLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RActivityLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RActivityLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
