import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ROsTasksComponent } from './r-os-tasks.component';

describe('ROsTasksComponent', () => {
  let component: ROsTasksComponent;
  let fixture: ComponentFixture<ROsTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ROsTasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ROsTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
