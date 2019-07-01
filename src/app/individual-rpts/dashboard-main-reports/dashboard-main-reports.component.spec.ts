import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainRdashboardComponent } from './dashboard-main-reports.component';

describe('MainRdashboardComponent', () => {
  let component: MainRdashboardComponent;
  let fixture: ComponentFixture<MainRdashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainRdashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainRdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
