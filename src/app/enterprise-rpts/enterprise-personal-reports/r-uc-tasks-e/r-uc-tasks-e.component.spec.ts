import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RUcTasksEComponent } from './r-uc-tasks-e.component';

describe('RUcTasksEComponent', () => {
  let component: RUcTasksEComponent;
  let fixture: ComponentFixture<RUcTasksEComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RUcTasksEComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RUcTasksEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
