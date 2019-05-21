import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalInfoReportComponent } from './personal-info-report.component';

describe('PersonalInfoReportComponent', () => {
  let component: PersonalInfoReportComponent;
  let fixture: ComponentFixture<PersonalInfoReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalInfoReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalInfoReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
