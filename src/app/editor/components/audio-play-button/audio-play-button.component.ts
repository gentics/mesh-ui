import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';

@Component({
    selector: 'mesh-audio-play-button',
    templateUrl: './audio-play-button.component.html',
    styleUrls: ['./audio-play-button.component.scss']
})
export class AudioPlayButtonComponent implements OnInit {

    @Input() src: SafeUrl;
    @Input() autoPlay: Boolean = false;
    @ViewChild('AudioElement') audio: ElementRef;

    loadingPreview = false;

    ngOnInit() {
        // This callback is needed to trigger the angular change detection so that it renders a paused state of the play button.
        this.audio.nativeElement.onended = () => {
            this.audio.nativeElement.pause();
        };
    }

    onToggle() {
        this.audio.nativeElement.paused ? this.audio.nativeElement.play() : this.audio.nativeElement.pause();
    }
}
