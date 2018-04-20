import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaElementComponent } from './media-element.component';

describe('MediaElementComponent', () => {
  let component: MediaElementComponent;
  let fixture: ComponentFixture<MediaElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
