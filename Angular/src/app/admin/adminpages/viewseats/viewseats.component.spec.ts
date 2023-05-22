import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewseatsComponent } from './viewseats.component';

describe('ViewseatsComponent', () => {
  let component: ViewseatsComponent;
  let fixture: ComponentFixture<ViewseatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewseatsComponent]
    });
    fixture = TestBed.createComponent(ViewseatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
