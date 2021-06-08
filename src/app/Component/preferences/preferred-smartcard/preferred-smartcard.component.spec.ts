import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferredSmartcardComponent } from './preferred-smartcard.component';

describe('PreferredSmartcardComponent', () => {
  let component: PreferredSmartcardComponent;
  let fixture: ComponentFixture<PreferredSmartcardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferredSmartcardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferredSmartcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
