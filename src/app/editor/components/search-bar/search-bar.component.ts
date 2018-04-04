import { Component, ChangeDetectorRef, ViewChild, ContentChild, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { DropdownList } from 'gentics-ui-core';

import { ListStateActions } from '../../../state/providers/list-state-actions';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { ListEffectsService } from '../../../core/providers/effects/list-effects.service';
import { fuzzyMatch } from '../../../common/util/fuzzy-search';
import { EntitiesService } from '../../../state/providers/entities.service';
import { stringToColor } from '../../../common/util/util';
import { Tag } from '../../../common/models/tag.model';
import { NavigationService } from '../../../core/providers/navigation/navigation.service';


@Component({
    selector: 'mesh-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.scss']
})

export class SearchBarComponent implements OnInit, OnDestroy {

    private subscription: Subscription =  new Subscription();

    stateTags: Tag[] = [];
    private destroyed$: Subject<void> = new Subject();

    private searching = false;

    inputValue = '';
    searchQuery = '';

    searchTags: Tag[] = [];
    filteredTags: Tag[];

    @ViewChild(DropdownList)
    dropDownList: DropdownList;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private listEffects: ListEffectsService,
        private state: ApplicationStateService,
        private entities: EntitiesService,
        private route: ActivatedRoute,
        private router: Router,
        private navigationService: NavigationService,
    ) {}

    ngOnInit(): void {

        combineLatest(this.route.queryParamMap, this.state.select(state => state.entities.tag))
            .takeUntil(this.destroyed$)
            .subscribe(([paramMap, tagUuids]) => {
                this.searchParamsChanged(paramMap);
            });

        this.state.select(state => state.tags.tags)
            .takeUntil(this.destroyed$)
            .subscribe(tags => {
                this.stateTags = tags.map(uuid => this.entities.getTag(uuid));
            });
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
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
            this.listEffects.setFilterTerm(this.inputValue);
        }
    }

    onSearchTagSelected(tag: Tag): void {
        this.inputValue = '';
        this.updateSearchParams(this.searchQuery, [...this.searchTags, tag]);
    }

    onTagDeleted(tag: Tag): void {
        this.searchTags = this.searchTags.filter(searchTag => searchTag.uuid !== tag.uuid);
        this.updateSearchParams(this.searchQuery, this.searchTags);
    }

    searchTermChanged(): void {
        const firstChar = this.inputValue.charAt(0);
        if (firstChar === '#') { // In tag mode search - ignore this event
            return;
        }

        this.updateSearchParams(this.inputValue, this.searchTags);

        this.inputValue = '';
        this.listEffects.setFilterTerm(this.inputValue);
    }

    clearFilter(): void {
        this.inputValue = '';
        this.filterTermChanged();
    }

    clearSearch(): void {
        this.searchQuery = '';
        this.searchTermChanged();
    }

    private searchParamsChanged(params: ParamMap) {
        this.searchQuery = params.get('q') || '';
        this.searchTags = (params.get('t') || '').split(',')
                                .map(uuid => this.state.now.entities.tag[uuid])
                                .filter(tag => !!tag !== false);
        this.changeDetectorRef.detectChanges(); // If the browser 'back' was clicked
    }

    private filterTags(term: string): Tag[] {
        if (term.trim() === '') {
            return [];
        }

        const tags = this.stateTags.filter(tag => this.searchTags.every(searchTag => searchTag.uuid !== tag.uuid));

        const filteredTags = tags.reduce<Tag[]>((filteredTags, tag) => {

            if (fuzzyMatch(term, tag.name)) {
                filteredTags.push(tag) ;
            }
            return filteredTags;

        }, []);
        return filteredTags;
    }

    private updateSearchParams(query: string, tags: Tag[]): void {
        const q = query.trim();
        const t = tags.map(tag => tag.uuid).join(','); // Tags
        this.router.navigate([], { relativeTo: this.route, queryParams: {q, t}});
    }
}
