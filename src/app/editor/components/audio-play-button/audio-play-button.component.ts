import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'mesh-audio-play-button',
    templateUrl: './audio-play-button.component.html',
    styleUrls: ['./audio-play-button.component.scss']
})
export class AudioPlayButtonComponent implements OnInit {

    @Input() src: string;
    @Input() autoPlay: Boolean = false;
    @ViewChild('AudioElement') audio: ElementRef;

    ngOnInit() {
        this.audio.nativeElement.onended = () => {
            this.audio.nativeElement.pause();
        };
    }

    onToggle() {
        this.audio.nativeElement.paused ? this.audio.nativeElement.play() : this.audio.nativeElement.pause();
    }
}
