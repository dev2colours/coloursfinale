import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelOfDisciplineComponent } from './level-of-discipline.component';

describe('LevelOfDisciplineComponent', () => {
  let component: LevelOfDisciplineComponent;
  let fixture: ComponentFixture<LevelOfDisciplineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LevelOfDisciplineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelOfDisciplineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
