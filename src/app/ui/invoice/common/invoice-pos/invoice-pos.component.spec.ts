import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicePosComponent } from './invoice-pos.component';

describe('InvoicePosComponent', () => {
  let component: InvoicePosComponent;
  let fixture: ComponentFixture<InvoicePosComponent>;

  beforeEach(async(() => {
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
