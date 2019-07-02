import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalsActionItemsComponent } from './totals-action-items.component';

describe('TotalsActionItemsComponent', () => {
  let component: TotalsActionItemsComponent;
  let fixture: ComponentFixture<TotalsActionItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalsActionItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalsActionItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
