import { Component, Input, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';

const typesThatPreload = ['video', 'audio', 'image'];
@Component({
    selector: 'mesh-file-preview',
    templateUrl: './file-preview.component.html',
    styleUrls: ['./file-preview.component.scss']
})
export class FilePreviewComponent implements OnInit {
    @Input() mediaType: string;
    @Input() url: SafeUrl;

    protected loadingPreview = false;

    ngOnInit() {
        if ( typesThatPreload.indexOf(this.mediaType) !== -1) {
            this.loadingPreview = true;
        }
    }
}
