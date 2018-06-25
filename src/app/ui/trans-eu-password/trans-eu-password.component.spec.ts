import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransEuPasswordComponent } from './trans-eu-password.component';

describe('TransEuPasswordComponent', () => {
  let component: TransEuPasswordComponent;
  let fixture: ComponentFixture<TransEuPasswordComponent>;

  beforeEach(async(() => {
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
