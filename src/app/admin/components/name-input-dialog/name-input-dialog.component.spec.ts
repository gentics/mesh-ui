import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NameInputDialogComponent } from './name-input-dialog.component';

describe('NameInputDialogComponent', () => {
  let component: NameInputDialogComponent;
  let fixture: ComponentFixture<NameInputDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NameInputDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NameInputDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
