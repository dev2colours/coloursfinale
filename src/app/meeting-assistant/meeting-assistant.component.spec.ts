import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingAssistantComponent } from './meeting-assistant.component';

describe('MeetingAssistantComponent', () => {
  let component: MeetingAssistantComponent;
  let fixture: ComponentFixture<MeetingAssistantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingAssistantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingAssistantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
