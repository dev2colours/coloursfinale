import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RUcTasksComponent } from './r-uc-tasks.component';

describe('RUcTasksComponent', () => {
  let component: RUcTasksComponent;
  let fixture: ComponentFixture<RUcTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RUcTasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RUcTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
