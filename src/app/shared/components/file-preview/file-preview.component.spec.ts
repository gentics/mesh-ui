import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FilePreviewComponent } from './file-preview.component';
import { AudioPlayButtonComponent } from '../audio-play-button/audio-play-button.component';
import { GenticsUICoreModule } from 'gentics-ui-core';
import { By } from '@angular/platform-browser';

describe('FilePreviewComponent', () => {
    let component: FilePreviewComponent;
    let fixture: ComponentFixture<FilePreviewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FilePreviewComponent, AudioPlayButtonComponent],
            imports: [
                GenticsUICoreModule
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FilePreviewComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should render a video component', () => {
        component.mediaType = 'video';
        fixture.detectChanges();
        const video = fixture.debugElement.query(By.css('video'));
        expect(video).toBeTruthy();
    });

    it('should render an audio component', () => {
        component.mediaType = 'audio';
        fixture.detectChanges();
        const video = fixture.debugElement.query(By.css('audio'));
        expect(video).toBeTruthy();
    });

    it('should render an image component', () => {
        component.mediaType = 'image';
        fixture.detectChanges();
        const video = fixture.debugElement.query(By.css('img.preview'));
        expect(video).toBeTruthy();
    });

    it('should render a default placeholder', () => {
        component.mediaType = 'whatever';
        fixture.detectChanges();
        const video = fixture.debugElement.query(By.css('.default-preview'));
        expect(video).toBeTruthy();
    });
});
