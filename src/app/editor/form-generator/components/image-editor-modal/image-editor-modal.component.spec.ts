import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageEditorModalComponent } from './image-editor-modal.component';

describe('ImageEditorModalComponent', () => {
  let component: ImageEditorModalComponent;
  let fixture: ComponentFixture<ImageEditorModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageEditorModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageEditorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
