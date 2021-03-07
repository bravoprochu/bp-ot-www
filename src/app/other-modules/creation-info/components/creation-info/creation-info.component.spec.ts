import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationInfoComponent } from './creation-info.component';

describe('CreationInfoComponent', () => {
  let component: CreationInfoComponent;
  let fixture: ComponentFixture<CreationInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreationInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
