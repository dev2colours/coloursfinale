import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTaskComponent } from './map-task.component';

describe('MapTaskComponent', () => {
  let component: MapTaskComponent;
  let fixture: ComponentFixture<MapTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
