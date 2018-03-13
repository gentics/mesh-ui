import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiFileUploadDialogComponent } from './multi-file-upload-dialog.component';

describe('MultiFileUploadDialogComponent', () => {
  let component: MultiFileUploadDialogComponent;
  let fixture: ComponentFixture<MultiFileUploadDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiFileUploadDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiFileUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
