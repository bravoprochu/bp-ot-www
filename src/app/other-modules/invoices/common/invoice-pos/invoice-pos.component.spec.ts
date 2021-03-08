import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InvoicePosComponent } from './invoice-pos.component';

describe('InvoicePosComponent', () => {
  let component: InvoicePosComponent;
  let fixture: ComponentFixture<InvoicePosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoicePosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicePosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
