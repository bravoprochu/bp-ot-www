import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ErrorObjectComponent } from './error-object.component';

describe('ErrorObjectComponent', () => {
  let component: ErrorObjectComponent;
  let fixture: ComponentFixture<ErrorObjectComponent>;

  beforeEach(waitForAsync(() => {
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
