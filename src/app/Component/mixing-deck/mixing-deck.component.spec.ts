import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MixingDeckComponent } from './mixing-deck.component';

describe('MixingDeckComponent', () => {
  let component: MixingDeckComponent;
  let fixture: ComponentFixture<MixingDeckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MixingDeckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MixingDeckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
