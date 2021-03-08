import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InvoiceBuyComponent } from './invoice-buy.component';

describe('InvoiceBuyComponent', () => {
  let component: InvoiceBuyComponent;
  let fixture: ComponentFixture<InvoiceBuyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceBuyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
