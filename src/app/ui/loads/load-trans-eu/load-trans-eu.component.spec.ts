import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoadTransEuComponent } from './load-trans-eu.component';

describe('LoadTransEuComponent', () => {
  let component: LoadTransEuComponent;
  let fixture: ComponentFixture<LoadTransEuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadTransEuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadTransEuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
