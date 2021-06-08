import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MytripMyseasonsComponent } from './mytrip-myseasons.component';

describe('MytripMyseasonsComponent', () => {
  let component: MytripMyseasonsComponent;
  let fixture: ComponentFixture<MytripMyseasonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MytripMyseasonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MytripMyseasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
