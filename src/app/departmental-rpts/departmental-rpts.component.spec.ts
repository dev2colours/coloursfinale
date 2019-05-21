import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentalRptsComponent } from './departmental-rpts.component';

describe('DepartmentalRptsComponent', () => {
  let component: DepartmentalRptsComponent;
  let fixture: ComponentFixture<DepartmentalRptsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DepartmentalRptsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentalRptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
