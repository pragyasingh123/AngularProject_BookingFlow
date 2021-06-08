import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SortByPopupComponent } from './sort-by-popup.component';

describe('SortByPopupComponent', () => {
  let component: SortByPopupComponent;
  let fixture: ComponentFixture<SortByPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SortByPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortByPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
