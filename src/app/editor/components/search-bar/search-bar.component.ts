import { Component, ChangeDetectorRef, ViewChild, ContentChild, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { EventEmitter } from 'protractor/node_modules/@types/selenium-webdriver';

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
import { NavigationService } from '../../../core/providers/navigation/navigation.service';

@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.scss']
})

export class SearchBarComponent implements OnInit, OnDestroy {

    private subscription: Subscription =  new Subscription();

    private searching = false;

    inputValue = '';
    searchQuery = '';

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
        private route: ActivatedRoute,
        private router: Router,
        private navigationService: NavigationService,
    ) {}

    ngOnInit(): void {
        this.subscription.add(combineLatest(this.route.queryParamMap, this.state.select(state => state.entities.tag))
            .subscribe(([paramMap, tagUuids]) => {
                this.searchParamsChanged(paramMap);
            }));
    }

    private searchParamsChanged(params: ParamMap) {
        this.searchQuery = params.get('q') || '';
        this.searchTags = (params.get('t') || '').split(',')
                                .map(uuid => this.state.now.entities.tag[uuid])
                                .filter(tag => !!tag !== false);
        this.changeDetectorRef.detectChanges(); // If the browser 'back' was clicked
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

    filterTermChanged(): void {
        const firstChar = this.inputValue.charAt(0);

        if (firstChar === '#') {
            this.filteredTags = this.filterTags(this.inputValue.substr(1));
            if (!this.dropDownList.isOpen) {
                this.dropDownList.openDropdown();
            } else {
                this.dropDownList.resize();
            }

        } else {
            this.state.actions.list.setFilterTerm(this.inputValue);
        }
    }

    onSearchTagSelected(tag: Tag): void {
        this.inputValue = '';
        this.updateSearchParams(this.searchQuery, [...this.searchTags, tag]);
    }

    onTagDeleted(tag: Tag): void {
        this.searchTags = this.searchTags.filter(searchTag => searchTag.uuid !== tag.uuid);
        this.updateSearchParams(this.searchQuery, this.searchTags.filter(searchTag => searchTag.uuid !== tag.uuid));
    }

    searchTermChanged(): void {

        const firstChar = this.inputValue.charAt(0);
        if (firstChar === '#') { // In tag mode search - ignore this event
            return;
        }

        this.updateSearchParams(this.inputValue, this.searchTags);

        this.inputValue = '';
        this.state.actions.list.setFilterTerm(this.inputValue);
    }

    private updateSearchParams(query: string, tags: Tag[]): void {
        const q = query.trim();
        const t = tags.map(tag => tag.uuid).join(','); // Tags
        this.router.navigate([], { relativeTo: this.route, queryParams: {q, t}});
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
