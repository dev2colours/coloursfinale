import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ROsActionsEComponent } from './r-os-actions-e.component';

describe('ROsActionsEComponent', () => {
  let component: ROsActionsEComponent;
  let fixture: ComponentFixture<ROsActionsEComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ROsActionsEComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ROsActionsEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
