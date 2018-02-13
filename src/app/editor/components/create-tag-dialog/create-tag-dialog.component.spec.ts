import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTagDialogComponent } from './create-tag-dialog.component';

describe('CreateTagDialogComponent', () => {
  let component: CreateTagDialogComponent;
  let fixture: ComponentFixture<CreateTagDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTagDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTagDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
