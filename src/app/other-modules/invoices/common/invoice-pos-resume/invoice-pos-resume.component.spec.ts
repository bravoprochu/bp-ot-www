import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InvoicePosResumeComponent } from './invoice-pos-resume.component';

describe('InvoicePosResumeComponent', () => {
  let component: InvoicePosResumeComponent;
  let fixture: ComponentFixture<InvoicePosResumeComponent>;

  beforeEach(waitForAsync(() => {
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
