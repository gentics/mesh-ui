import { Component, OnInit, Input } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';

@Component({
    selector: 'mesh-media-element',
    templateUrl: './media-element.component.html',
    styleUrls: ['./media-element.component.scss']
})
export class MediaElementComponent implements OnInit {
    @Input() mediaType: string;
    @Input() url: SafeUrl;
    @Input() fileName: string;


    loadingPreview = false;

    ngOnInit() {
        if (this.mediaType === 'video') {
            this.loadingPreview = true;
        }
    }
}
