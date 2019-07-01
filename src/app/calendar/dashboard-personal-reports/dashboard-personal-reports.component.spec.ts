import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalRdashboardComponent } from './dashboard-personal-reports.component';

describe('PersonalRdashboardComponent', () => {
  let component: PersonalRdashboardComponent;
  let fixture: ComponentFixture<PersonalRdashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalRdashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalRdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
