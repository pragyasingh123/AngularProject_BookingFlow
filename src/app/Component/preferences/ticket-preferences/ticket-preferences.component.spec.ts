import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketPreferencesComponent } from './ticket-preferences.component';

describe('TicketPreferencesComponent', () => {
  let component: TicketPreferencesComponent;
  let fixture: ComponentFixture<TicketPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketPreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
