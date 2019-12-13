import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineOneComponent } from './line-one.component';

describe('LineOneComponent', () => {
  let component: LineOneComponent;
  let fixture: ComponentFixture<LineOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LineOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
