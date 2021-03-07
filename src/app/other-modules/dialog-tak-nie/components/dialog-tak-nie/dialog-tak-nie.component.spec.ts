import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTakNieComponent } from './dialog-tak-nie.component';

describe('DialogTakNieComponent', () => {
  let component: DialogTakNieComponent;
  let fixture: ComponentFixture<DialogTakNieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogTakNieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTakNieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
