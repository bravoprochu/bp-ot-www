import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceBuyListComponent } from './invoice-buy-list.component';

describe('InvoiceBuyListComponent', () => {
  let component: InvoiceBuyListComponent;
  let fixture: ComponentFixture<InvoiceBuyListComponent>;

  beforeEach(async(() => {
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
