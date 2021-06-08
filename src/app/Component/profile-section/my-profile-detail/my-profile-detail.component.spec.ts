import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProfileDetailComponent } from './my-profile-detail.component';

describe('MyProfileDetailComponent', () => {
  let component: MyProfileDetailComponent;
  let fixture: ComponentFixture<MyProfileDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyProfileDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProfileDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
