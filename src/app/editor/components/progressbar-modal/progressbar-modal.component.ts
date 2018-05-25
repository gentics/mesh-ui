import { Component, OnInit } from '@angular/core';
import { IModalDialog, ProgressBar } from 'gentics-ui-core';

@Component({
  selector: 'mesh-progressbar-modal',
  templateUrl: './progressbar-modal.component.html',
  styleUrls: ['./progressbar-modal.component.scss']
})
export class ProgressbarModalComponent implements IModalDialog {

  translateToPlural = false;

  closeFn: (val: any) => void;
  cancelFn: (val?: any) => void;

  registerCloseFn(close: (val: any) => void): void {
    this.closeFn = close;
  }

  registerCancelFn(cancel: (val?: any) => void): void {
    this.cancelFn = cancel;
  }
}
