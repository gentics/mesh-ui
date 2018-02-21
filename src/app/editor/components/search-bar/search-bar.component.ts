import { Component, ChangeDetectorRef, ViewChild, ContentChild, OnInit } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { EventEmitter } from 'protractor/node_modules/@types/selenium-webdriver';
import { Observable } from 'rxjs/Observable';
import { DropdownList } from 'gentics-ui-core';

import { ApiService } from '../../../core/providers/api/api.service';
import { ListStateActions } from '../../../state/providers/list-state-actions';
import { ApplicationStateService } from '../../../state/providers/application-state.service';


import { ListEffectsService } from '../../../core/providers/effects/list-effects.service';
import { FilterSelection } from '../../../common/models/common.model';
import { fuzzyReplace } from '../../../common/util/fuzzy-search';
import { EntitiesService } from '../../../state/providers/entities.service';

import { stringToColor } from '../../../common/util/util';

@Component({
    selector: 'search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.scss']
})

export class SearchBarComponent implements OnInit {
    private searching = false;

    filterTerm$: Observable<string>;
    searchTerm$: Observable<string>;

    filteredTags: FilterSelection[];

    @ViewChild(DropdownList)
    dropDownList: DropdownList;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private api: ApiService,
        private listEffects: ListEffectsService,
        private state: ApplicationStateService,
        private entities: EntitiesService,
        private sanitized: DomSanitizer,
    ) {}

    ngOnInit(): void {
        this.filterTerm$ = this.state.select(state => state.list.filterTerm);
        this.searchTerm$ = this.state.select(state => state.list.searchTerm);
    }

    getTagBackgroundColor(familyName: string): SafeStyle {
        return this.sanitized.bypassSecurityTrustStyle(stringToColor(familyName));
    }

    private filterTags(term: string): FilterSelection[] {
        if (term.trim() === '') {
            return [];
        }
        const tags = this.state.now.tags.tags.map(uuid => this.entities.getTag(uuid));
        const filteredTags = tags.reduce<FilterSelection[]>((filteredTags, tag) => {
            const matchedName = fuzzyReplace(term, tag.name);
            return (matchedName === null) ? filteredTags : [...filteredTags, { ...matchedName, tag }];
        }, []);
        return filteredTags;
    }

    /**
     * Update the filterTerm state
     */
    filterTermChanged(term: string): void {
        const firstChar = term.charAt(0);
        if (firstChar === '#' && term.length > 1) {
            this.filteredTags = this.filterTags(term.substr(1));
            console.log('what do we have in filter taga', this.filteredTags);
            if (!this.dropDownList.isOpen) {
                this.dropDownList.openDropdown();
            }
            this.dropDownList.resize();
        } else {
            this.state.actions.list.setFilterTerm(term);
        }
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
