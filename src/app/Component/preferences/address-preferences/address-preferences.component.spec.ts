import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressPreferencesComponent } from './address-preferences.component';

describe('AddressPreferencesComponent', () => {
  let component: AddressPreferencesComponent;
  let fixture: ComponentFixture<AddressPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressPreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
