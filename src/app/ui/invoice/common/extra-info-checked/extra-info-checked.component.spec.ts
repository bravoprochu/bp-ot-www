import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraInfoCheckedComponent } from './extra-info-checked.component';

describe('ExtraInfoCheckedComponent', () => {
  let component: ExtraInfoCheckedComponent;
  let fixture: ComponentFixture<ExtraInfoCheckedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtraInfoCheckedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraInfoCheckedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
