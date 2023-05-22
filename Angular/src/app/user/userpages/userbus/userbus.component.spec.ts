import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserbusComponent } from './userbus.component';

describe('UserbusComponent', () => {
  let component: UserbusComponent;
  let fixture: ComponentFixture<UserbusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserbusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserbusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
