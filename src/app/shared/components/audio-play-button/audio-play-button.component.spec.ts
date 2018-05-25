import { DebugElement } from '@angular/core';
import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Icon } from 'gentics-ui-core';

import { AudioPlayButtonComponent } from './audio-play-button.component';

describe('AudioPlayButtonComponent', () => {
    let component: AudioPlayButtonComponent;
    let fixture: ComponentFixture<AudioPlayButtonComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AudioPlayButtonComponent, Icon]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AudioPlayButtonComponent);
        component = fixture.componentInstance;
        component.onToggle = jasmine.createSpy('onToggle');
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(
        'should render an autoPlay attribute if it was requested',
        fakeAsync(() => {
            component.autoPlay = true;
            fixture.detectChanges();
            tick();
            const audioElement: DebugElement = fixture.debugElement.query(By.css('audio'));
            expect(audioElement.attributes['autoplay']).toEqual('autoplay');
        })
    );

    it('should play/pause the audio', () => {
        const toggleButton: DebugElement = fixture.debugElement.query(By.css('icon'));
        toggleButton.triggerEventHandler('click', null);
        expect(component.onToggle).toHaveBeenCalled();
    });
});
