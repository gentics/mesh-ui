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
import { Tag } from '../../../common/models/tag.model';

@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.scss']
})

export class SearchBarComponent implements OnInit {
    private searching = false;

    inputValue: string = '';
    searchQuery: string = '';
    //filterTerm$: Observable<string>;
    //searchTerm$: Observable<string>;
    searchTags: Tag[] = [];

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
        //this.filterTerm$ = this.state.select(state => state.list.filterTerm);
        //this.searchTerm$ = this.state.select(state => state.list.searchTerm);
    }

    private filterTags(term: string): FilterSelection[] {
        if (term.trim() === '') {
            return [];
        }

        const tags = this.state.now.tags.tags
                        .map(uuid => this.entities.getTag(uuid))
                        .filter(tag => this.searchTags.every(searchTag => searchTag.uuid !== tag.uuid));

        const filteredTags = tags.reduce<FilterSelection[]>((filteredTags, tag) => {
            const matchedName = fuzzyReplace(term, tag.name);
            return (matchedName === null) ? filteredTags : [...filteredTags, { ...matchedName, tag }];
        }, []);
        return filteredTags;
    }

    /**
     * Update the filterTerm state
     */
    filterTermChanged(): void {
        const firstChar = this.inputValue.charAt(0);
        if (firstChar === '#') {
            this.filteredTags = this.filterTags(this.inputValue.substr(1));
            if (!this.dropDownList.isOpen) {
                this.dropDownList.openDropdown();
            }
            this.dropDownList.resize();
        } else {
            this.state.actions.list.setFilterTerm(this.inputValue);
        }
    }

    onSearchTagSelected(tag: Tag): void {
        this.searchTags = [...this.searchTags, tag];
        this.inputValue = '';

        this.listEffects.searhNodesByTags(this.searchTags, this.state.now.list.currentProject);
    }

    onTagDeleted(tag: Tag): void {
        this.searchTags = this.searchTags.filter(searchTag => searchTag.uuid !== tag.uuid);
        this.listEffects.searhNodesByTags(this.searchTags, this.state.now.list.currentProject);
    }

    /**
     * Update the searchTerm state
     */
    searchTermChanged(): void {
        const firstChar = this.inputValue.charAt(0);
        if (firstChar === '#') { // In tag mode search - ignore this event
            return;
        }

        this.searchQuery = this.inputValue.trim();
        // this.state.actions.list.setSearchTerm(term);

        if (!this.searchQuery) { // reset the search term
            this.listEffects.resetSearchByKeywordResults();
            this.listEffects.setActiveContainer(
                this.state.now.list.currentProject,
                this.state.now.list.currentNode,
                this.state.now.list.language);
        } else {
            this.listEffects.searchNodesByKeyword(this.searchQuery, this.state.now.list.currentProject, this.state.now.list.language);
        }

        this.inputValue = '';
        this.state.actions.list.setFilterTerm(this.inputValue);
    }
}
