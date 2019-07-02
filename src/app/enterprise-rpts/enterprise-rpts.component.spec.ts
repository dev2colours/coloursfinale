import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterpriseRptsComponent } from './enterprise-rpts.component';

describe('EnterpriseRptsComponent', () => {
  let component: EnterpriseRptsComponent;
  let fixture: ComponentFixture<EnterpriseRptsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EnterpriseRptsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterpriseRptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
