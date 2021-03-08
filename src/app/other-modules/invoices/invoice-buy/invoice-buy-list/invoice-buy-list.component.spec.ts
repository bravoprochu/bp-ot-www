import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InvoiceBuyListComponent } from './invoice-buy-list.component';

describe('InvoiceBuyListComponent', () => {
  let component: InvoiceBuyListComponent;
  let fixture: ComponentFixture<InvoiceBuyListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceBuyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceBuyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
