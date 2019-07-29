import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutetesterComponent } from './routetester.component';

describe('RoutetesterComponent', () => {
  let component: RoutetesterComponent;
  let fixture: ComponentFixture<RoutetesterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutetesterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutetesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
