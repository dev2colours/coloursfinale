import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassificationTimesheetComponent } from './classification-timesheet.component';

describe('ClassificationTimesheetComponent', () => {
  let component: ClassificationTimesheetComponent;
  let fixture: ComponentFixture<ClassificationTimesheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassificationTimesheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassificationTimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
