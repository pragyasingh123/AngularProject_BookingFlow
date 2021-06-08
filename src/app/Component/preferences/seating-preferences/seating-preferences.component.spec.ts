import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatingPreferencesComponent } from './seating-preferences.component';

describe('SeatingPreferencesComponent', () => {
  let component: SeatingPreferencesComponent;
  let fixture: ComponentFixture<SeatingPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeatingPreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeatingPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
