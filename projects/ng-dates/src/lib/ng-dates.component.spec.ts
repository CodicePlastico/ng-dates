import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgDatesComponent } from './ng-dates.component';

describe('NgDatesComponent', () => {
  let component: NgDatesComponent;
  let fixture: ComponentFixture<NgDatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgDatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
