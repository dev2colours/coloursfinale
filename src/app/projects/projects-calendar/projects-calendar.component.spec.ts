import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsCalendarComponent } from './projects-calendar.component';

describe('ProjectsCalendarComponent', () => {
  let component: ProjectsCalendarComponent;
  let fixture: ComponentFixture<ProjectsCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectsCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
