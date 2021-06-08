import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NectarCardLoyaltyComponent } from './nectar-card-loyalty.component';

describe('NectarCardLoyaltyComponent', () => {
  let component: NectarCardLoyaltyComponent;
  let fixture: ComponentFixture<NectarCardLoyaltyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NectarCardLoyaltyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NectarCardLoyaltyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
