import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatingPrefrencesComponent } from './seating-prefrences.component';

describe('SeatingPrefrencesComponent', () => {
  let component: SeatingPrefrencesComponent;
  let fixture: ComponentFixture<SeatingPrefrencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeatingPrefrencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeatingPrefrencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
