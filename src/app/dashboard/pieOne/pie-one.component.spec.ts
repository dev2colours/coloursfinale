import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PieOneComponent } from './pie-one.component';

describe('PieOneComponent', () => {
  let component: PieOneComponent;
  let fixture: ComponentFixture<PieOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PieOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PieOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
