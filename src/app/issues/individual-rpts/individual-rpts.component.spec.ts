import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualRptsComponent } from './individual-rpts.component';

describe('IndividualRptsComponent', () => {
  let component: IndividualRptsComponent;
  let fixture: ComponentFixture<IndividualRptsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IndividualRptsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualRptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
