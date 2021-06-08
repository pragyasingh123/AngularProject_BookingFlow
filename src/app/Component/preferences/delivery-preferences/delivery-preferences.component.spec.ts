import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryPreferencesComponent } from './delivery-preferences.component';

describe('DeliveryPreferencesComponent', () => {
  let component: DeliveryPreferencesComponent;
  let fixture: ComponentFixture<DeliveryPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryPreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
