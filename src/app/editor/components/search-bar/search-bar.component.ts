import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { ListEffectsService } from '../../../core/providers/effects/list-effects.service';
import { fuzzyMatch } from '../../../common/util/fuzzy-search';
import { EntitiesService } from '../../../state/providers/entities.service';
import { Tag } from '../../../common/models/tag.model';
import { notNullOrUndefined } from "../../../common/util/util";


@Component({
    selector: 'mesh-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBarComponent implements OnInit, OnDestroy {

    allTags: Tag[] = [];
    inputValue = '';
    searchQuery = '';
    displayTagSelection = false;
    searchTags: Tag[] = [];
    filteredTags: Tag[] = [];
    private destroyed$: Subject<void> = new Subject();

    constructor(private changeDetectorRef: ChangeDetectorRef,
                private listEffects: ListEffectsService,
                private state: ApplicationStateService,
                private entities: EntitiesService,
                private route: ActivatedRoute,
                private router: Router) {}

    ngOnInit(): void {

        combineLatest(this.route.queryParamMap, this.state.select(state => state.entities.tag))
            .takeUntil(this.destroyed$)
            .subscribe(([paramMap]) => {
                this.searchParamsChanged(paramMap);
            });

        this.state.select(state => state.tags.tags)
            .takeUntil(this.destroyed$)
            .subscribe(tags => {
                this.allTags = tags.map(uuid => this.entities.getTag(uuid)).filter(notNullOrUndefined);
            });
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    filterTermChanged(): void {
        const firstChar = this.inputValue.charAt(0);
        if (firstChar === '#') {
            this.filteredTags = this.filterTags(this.allTags, this.searchTags, this.inputValue.substr(1));
            this.displayTagSelection = true;
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
        this.searchTags = (params.get('t') || '')
            .split(',')
            .map(uuid => this.entities.getTag(uuid))
            .filter(notNullOrUndefined);

        // Required if the browser 'back' or 'forward' button was clicked
        this.changeDetectorRef.markForCheck();
    }

    private filterTags(allTags: Tag[], selectedTags: Tag[], filterTerm: string): Tag[] {
        if (filterTerm.trim() === '') {
            return [];
        }
        const availableTags = allTags.filter(tag => selectedTags.every(searchTag => searchTag.uuid !== tag.uuid));
        return availableTags.filter(tag => fuzzyMatch(filterTerm, tag.name));
    }

    private updateSearchParams(query: string, tags: Tag[]): void {
        const q = query.trim();
        const t = tags.map(tag => tag.uuid).join(','); // Tags
        this.router.navigate([], { relativeTo: this.route, queryParams: {q, t}});
    }
}
