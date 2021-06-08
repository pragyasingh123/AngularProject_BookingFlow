import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NectarCardConfirmationComponent } from './nectar-card-confirmation.component';

describe('NectarCardConfirmationComponent', () => {
  let component: NectarCardConfirmationComponent;
  let fixture: ComponentFixture<NectarCardConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NectarCardConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NectarCardConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
