import { Component, trigger, state, style, transition, animate } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ApiService } from '../../../core/providers/api/api.service';
import { ElementRef } from '@angular/core';



@Component({
    selector: 'search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.scss'],
    animations: [
        trigger('formState', [
            state('visible', style({
              opacity: '1',
              display: 'block'
            })),
            state('hidden',   style({
              opacity: '0',
              display: 'none'
            })),
            transition('visible => hidden', animate('100ms ease-in')),
            transition('hidden => visible', animate('100ms ease-out'))
        ])
    ]
})

export class SearchBarComponent {
    protected searching = false;
    public formState = 'hidden';

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private api: ApiService
    ) {}

    search(fraze: String) {
        this.searching = true;
        setTimeout(() => {
            this.searching = false;
            this.changeDetectorRef.detectChanges();
        }, 1000);
    }
}
