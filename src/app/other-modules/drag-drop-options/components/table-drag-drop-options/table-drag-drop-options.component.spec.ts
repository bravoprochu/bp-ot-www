import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TableDragDropOptionsComponent } from './table-drag-drop-options.component';

describe('TableDragDropOptionsComponent', () => {
  let component: TableDragDropOptionsComponent;
  let fixture: ComponentFixture<TableDragDropOptionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TableDragDropOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableDragDropOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
