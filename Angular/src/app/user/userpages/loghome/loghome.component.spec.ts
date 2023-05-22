import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoghomeComponent } from './loghome.component';

describe('LoghomeComponent', () => {
  let component: LoghomeComponent;
  let fixture: ComponentFixture<LoghomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoghomeComponent]
    });
    fixture = TestBed.createComponent(LoghomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
