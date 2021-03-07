import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceSellGroupCloneComponent } from './invoice-sell-group-clone.component';

describe('InvoiceSellGroupCloneComponent', () => {
  let component: InvoiceSellGroupCloneComponent;
  let fixture: ComponentFixture<InvoiceSellGroupCloneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceSellGroupCloneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceSellGroupCloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
