import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicePosResumeComponent } from './invoice-pos-resume.component';

describe('InvoicePosResumeComponent', () => {
  let component: InvoicePosResumeComponent;
  let fixture: ComponentFixture<InvoicePosResumeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoicePosResumeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicePosResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
