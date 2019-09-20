import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ROsTasksEComponent } from './r-os-tasks-e.component';

describe('ROsTasksEComponent', () => {
  let component: ROsTasksEComponent;
  let fixture: ComponentFixture<ROsTasksEComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ROsTasksEComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ROsTasksEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
