import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterpriseRpersonalComponent } from './enterprise-personal-reports.component';

describe('EnterpriseRpersonalComponent', () => {
  let component: EnterpriseRpersonalComponent;
  let fixture: ComponentFixture<EnterpriseRpersonalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterpriseRpersonalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterpriseRpersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
