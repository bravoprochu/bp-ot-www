import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoadSellComponent } from './load-sell.component';

describe('LoadSellComponent', () => {
  let component: LoadSellComponent;
  let fixture: ComponentFixture<LoadSellComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadSellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadSellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
