import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeConflictDialogComponent } from './node-conflict-dialog.component';

describe('NodeConflictDialogComponent', () => {
  let component: NodeConflictDialogComponent;
  let fixture: ComponentFixture<NodeConflictDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeConflictDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeConflictDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
