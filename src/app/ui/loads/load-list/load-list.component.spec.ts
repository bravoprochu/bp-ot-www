import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadListComponent } from './load-list.component';

describe('LoadListComponent', () => {
  let component: LoadListComponent;
  let fixture: ComponentFixture<LoadListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
