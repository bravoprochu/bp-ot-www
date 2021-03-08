import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CurrencyNbpComponent } from './currency-nbp.component';

describe('CurrencyNbpComponent', () => {
  let component: CurrencyNbpComponent;
  let fixture: ComponentFixture<CurrencyNbpComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrencyNbpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyNbpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
