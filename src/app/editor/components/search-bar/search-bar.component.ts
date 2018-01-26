import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../../core/providers/api/api.service';

@Component({
    selector: 'search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.scss'],
})

export class SearchBarComponent {
    protected searching = false;
    protected filtersOpen = false;

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

    openFilters() {
        this.filtersOpen = true;
    }

    closeFilters() {
        this.filtersOpen = false;
    }
}
