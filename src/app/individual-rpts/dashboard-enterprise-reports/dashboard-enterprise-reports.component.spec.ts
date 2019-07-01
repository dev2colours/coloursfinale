import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterpriseRdashboardComponent } from './dashboard-enterprise-reports.component';

describe('EnterpriseRdashboardComponent', () => {
  let component: EnterpriseRdashboardComponent;
  let fixture: ComponentFixture<EnterpriseRdashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterpriseRdashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterpriseRdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
