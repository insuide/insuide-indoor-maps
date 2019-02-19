import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawingtoolComponent } from './drawingtool.component';

describe('DrawingtoolComponent', () => {
  let component: DrawingtoolComponent;
  let fixture: ComponentFixture<DrawingtoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawingtoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingtoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
