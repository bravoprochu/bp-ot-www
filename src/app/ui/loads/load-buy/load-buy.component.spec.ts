import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadBuyComponent } from './load-buy.component';

describe('LoadBuyComponent', () => {
  let component: LoadBuyComponent;
  let fixture: ComponentFixture<LoadBuyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadBuyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
