import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectRdashboardComponent } from './dashboard-project-reports.component';

describe('ProjectRdashboardComponent', () => {
  let component: ProjectRdashboardComponent;
  let fixture: ComponentFixture<ProjectRdashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectRdashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectRdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
