import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectedIncomeComponent } from './projected-income.component';

describe('ProjectedIncomeComponent', () => {
  let component: ProjectedIncomeComponent;
  let fixture: ComponentFixture<ProjectedIncomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectedIncomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectedIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
