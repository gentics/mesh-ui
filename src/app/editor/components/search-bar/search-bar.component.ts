import { Component, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../../../core/providers/api/api.service';
import { clearTimeout } from 'timers';
import { ListStateActions } from '../../../state/providers/list-state-actions';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { EventEmitter } from 'protractor/node_modules/@types/selenium-webdriver';
import { Observable } from 'rxjs/Observable';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { ListEffectsService } from '../../../core/providers/effects/list-effects.service';

@Component({
    selector: 'search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.scss']
})

export class SearchBarComponent implements OnInit {
    private searching = false;

    filterTerm$: Observable<string>;
    searchTerm$: Observable<string>;


    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private api: ApiService,
        private listEffects: ListEffectsService,
        private state: ApplicationStateService
    ) {}

    ngOnInit(): void {

        this.filterTerm$ = this.state.select(state => state.list.filterTerm);
        this.searchTerm$ = this.state.select(state => state.list.searchTerm);
    }

    /**
     * Update the filterTerm state
     */
    filterTermChanged(term: string): void {
        this.state.actions.list.setFilterTerm(term);
    }

    /**
     * Update the searchTerm state
     */
    searchTermChanged(term: string): void {

        term = term.trim();
        this.filterTermChanged('');
        this.state.actions.list.setSearchTerm(term);

        if (!term) {
            this.listEffects.setActiveContainer(
                this.state.now.list.currentProject,
                this.state.now.list.currentNode,
                this.state.now.list.language);
        } else {
            this.listEffects.searchChildren(term, this.state.now.list.currentProject, this.state.now.list.language);
        }
    }
}
