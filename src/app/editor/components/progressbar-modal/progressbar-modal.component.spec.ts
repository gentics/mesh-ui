import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';

import { ProgressbarModalComponent } from './progressbar-modal.component';
import { ProgressBar, OverlayHostService } from 'gentics-ui-core';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { MockI18nPipe } from "../../../shared/pipes/i18n/i18n.pipe.mock";


describe('ModalProgressbarComponent', () => {
  let component: ProgressbarModalComponent;

  let fixture: ComponentFixture<ProgressbarModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [
            ProgressbarModalComponent,
            ProgressBar,
            MockI18nPipe
        ],
        providers: [
            OverlayHostService,
        ]
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
