import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContinuousAuthorityComponent } from './continuous-authority.component';

describe('ContinuousAuthorityComponent', () => {
  let component: ContinuousAuthorityComponent;
  let fixture: ComponentFixture<ContinuousAuthorityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContinuousAuthorityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContinuousAuthorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
