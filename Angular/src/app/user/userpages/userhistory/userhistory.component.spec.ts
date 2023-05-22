import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserhistoryComponent } from './userhistory.component';

describe('UserhistoryComponent', () => {
  let component: UserhistoryComponent;
  let fixture: ComponentFixture<UserhistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserhistoryComponent]
    });
    fixture = TestBed.createComponent(UserhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
