import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RTimeBudgetComponent } from './r-time-budget.component';

describe('RTimeBudgetComponent', () => {
  let component: RTimeBudgetComponent;
  let fixture: ComponentFixture<RTimeBudgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RTimeBudgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RTimeBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
