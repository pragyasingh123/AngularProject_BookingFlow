import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketPrefrencesComponent } from './ticket-prefrences.component';

describe('TicketPrefrencesComponent', () => {
  let component: TicketPrefrencesComponent;
  let fixture: ComponentFixture<TicketPrefrencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketPrefrencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketPrefrencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
