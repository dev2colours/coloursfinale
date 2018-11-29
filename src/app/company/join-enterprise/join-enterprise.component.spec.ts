import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinEnterpriseComponent } from './join-enterprise.component';

describe('JoinEnterpriseComponent', () => {
  let component: JoinEnterpriseComponent;
  let fixture: ComponentFixture<JoinEnterpriseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinEnterpriseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinEnterpriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
