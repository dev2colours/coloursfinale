import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingAssistantComponent } from './reporting-assistant.component';

describe('ReportingAssistantComponent', () => {
  let component: ReportingAssistantComponent;
  let fixture: ComponentFixture<ReportingAssistantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportingAssistantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportingAssistantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
