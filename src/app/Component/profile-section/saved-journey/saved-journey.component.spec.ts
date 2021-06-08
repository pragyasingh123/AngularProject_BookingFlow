import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedJourneyComponent } from './saved-journey.component';

describe('SavedJourneyComponent', () => {
  let component: SavedJourneyComponent;
  let fixture: ComponentFixture<SavedJourneyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavedJourneyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedJourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
