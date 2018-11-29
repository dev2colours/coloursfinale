import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinProjectComponent } from './join-project.component';

describe('JoinProjectComponent', () => {
  let component: JoinProjectComponent;
  let fixture: ComponentFixture<JoinProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JoinProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
