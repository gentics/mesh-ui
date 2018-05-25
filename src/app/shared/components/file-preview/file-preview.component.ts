import { Component, Input, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';

import { getFileType } from '../../common/get-file-type';

const typesThatPreload = ['video', 'audio', 'image'];

@Component({
    selector: 'mesh-file-preview',
    templateUrl: './file-preview.component.html',
    styleUrls: ['./file-preview.component.scss']
})
export class FilePreviewComponent implements OnInit {
    @Input() mimeType: string;
    @Input() fileName: string;
    @Input() url: SafeUrl;

    fileType: string;
    loadingPreview = false;

    ngOnInit() {
        this.fileType = getFileType(this.mimeType, this.fileName);
        if (typesThatPreload.indexOf(this.mimeType) !== -1) {
            this.loadingPreview = true;
        }
    }
}
