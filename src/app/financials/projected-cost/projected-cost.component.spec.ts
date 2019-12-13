import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectedCostComponent } from './projected-cost.component';

describe('ProjectedCostComponent', () => {
  let component: ProjectedCostComponent;
  let fixture: ComponentFixture<ProjectedCostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectedCostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectedCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
