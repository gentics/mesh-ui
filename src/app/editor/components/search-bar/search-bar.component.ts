import { Component, ChangeDetectorRef, ViewChild, ContentChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { clearTimeout } from 'timers';
import { ApiService } from '../../../core/providers/api/api.service';
import { ListStateActions } from '../../../state/providers/list-state-actions';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { EventEmitter } from 'protractor/node_modules/@types/selenium-webdriver';

import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { ListEffectsService } from '../../../core/providers/effects/list-effects.service';
import { DropdownList } from 'gentics-ui-core';

@Component({
    selector: 'search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.scss']
})

export class SearchBarComponent implements OnInit {
    private searching = false;

    filterTerm$: Observable<string>;
    searchTerm$: Observable<string>;

    @ViewChild(DropdownList)
    dropDownList: DropdownList;

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

        const firstChar = term.charAt(0);

        if (firstChar === '#') {
            if (!this.dropDownList.isOpen) {
                this.dropDownList.openDropdown();


            }
        } else {

        }

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
