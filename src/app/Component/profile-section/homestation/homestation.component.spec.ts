import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomestationComponent } from './homestation.component';

describe('HomestationComponent', () => {
  let component: HomestationComponent;
  let fixture: ComponentFixture<HomestationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomestationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomestationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
