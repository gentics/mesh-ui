import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressbarModalComponent } from './progressbar-modal.component';

describe('ModalProgressbarComponent', () => {
  let component: ProgressbarModalComponent;
  let fixture: ComponentFixture<ProgressbarModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressbarModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressbarModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
