import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportbookComponent } from './reportbook.component';

describe('NotebookComponent', () => {
  let component: ReportbookComponent;
  let fixture: ComponentFixture<ReportbookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReportbookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
