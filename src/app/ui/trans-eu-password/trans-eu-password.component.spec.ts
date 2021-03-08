import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TransEuPasswordComponent } from './trans-eu-password.component';

describe('TransEuPasswordComponent', () => {
  let component: TransEuPasswordComponent;
  let fixture: ComponentFixture<TransEuPasswordComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TransEuPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransEuPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
