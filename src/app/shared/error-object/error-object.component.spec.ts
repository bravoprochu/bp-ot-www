import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorObjectComponent } from './error-object.component';

describe('ErrorObjectComponent', () => {
  let component: ErrorObjectComponent;
  let fixture: ComponentFixture<ErrorObjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorObjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
