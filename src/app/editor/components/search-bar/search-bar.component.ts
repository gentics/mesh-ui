import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EMeshNodeStatusStrings } from 'src/app/shared/components/node-status/node-status.component';

import { Tag } from '../../../common/models/tag.model';
import { fuzzyMatch } from '../../../common/util/fuzzy-search';
import { notNullOrUndefined, parseNodeStatusFilterString } from '../../../common/util/util';
import { ListEffectsService } from '../../../core/providers/effects/list-effects.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { EntitiesService } from '../../../state/providers/entities.service';

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
    searchNodeStatusFilter: EMeshNodeStatusStrings[] = [];
    nodeStatuses: EMeshNodeStatusStrings[] = Object.values(EMeshNodeStatusStrings);
    private destroyed$: Subject<void> = new Subject();

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private listEffects: ListEffectsService,
        private state: ApplicationStateService,
        private entities: EntitiesService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        combineLatest(this.route.queryParamMap, this.state.select(state => state.entities.tag))
            .pipe(takeUntil(this.destroyed$))
            .subscribe(([paramMap]) => {
                this.searchParamsChanged(paramMap);
            });

        this.state
            .select(state => state.tags.tags)
            .pipe(takeUntil(this.destroyed$))
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
        this.updateSearchParams(this.searchQuery, [...this.searchTags, tag], this.searchNodeStatusFilter);
    }

    onTagDeleted(tag: Tag): void {
        this.searchTags = this.searchTags.filter(searchTag => searchTag.uuid !== tag.uuid);
        this.updateSearchParams(this.searchQuery, this.searchTags, this.searchNodeStatusFilter);
    }

    onNodeStatusFilterSelected(selectedNodeStatusFilter: EMeshNodeStatusStrings[]): void {
        this.updateSearchParams(this.searchQuery, this.searchTags, selectedNodeStatusFilter);
    }

    searchTermChanged(): void {
        const firstChar = this.inputValue.charAt(0);
        if (firstChar === '#') {
            // In tag mode search - ignore this event
            return;
        }

        this.updateSearchParams(this.inputValue, this.searchTags, this.searchNodeStatusFilter);

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
        this.searchQuery = params.get('q') || '';
        this.searchTags = (params.get('t') || '')
            .split(',')
            .map(uuid => this.entities.getTag(uuid))
            .filter(notNullOrUndefined);
        this.searchNodeStatusFilter = parseNodeStatusFilterString(params.get('n') || '');

        // Required if the browser 'back' or 'forward' button was clicked
        this.changeDetectorRef.markForCheck();
    }

    private isEMeshNodeStatusString(string: string): string is EMeshNodeStatusStrings {
        return (
            typeof string === 'string' &&
            Object.values(EMeshNodeStatusStrings).includes(string as EMeshNodeStatusStrings)
        );
    }

    private filterTags(allTags: Tag[], selectedTags: Tag[], filterTerm: string): Tag[] {
        if (filterTerm.trim() === '') {
            return [];
        }
        const availableTags = allTags.filter(tag => selectedTags.every(searchTag => searchTag.uuid !== tag.uuid));
        return availableTags.filter(tag => fuzzyMatch(filterTerm, tag.name));
    }

    private updateSearchParams(query: string, tags: Tag[], selectedNodeStatusFilter: EMeshNodeStatusStrings[]): void {
        const q = query.trim();
        const t = tags.map(tag => tag.uuid).join(','); // Tags
        let n = selectedNodeStatusFilter.join(','); // Node status filter
        // if all filters are set, no node statuses have to be specified in the parameter
        if (this.nodeStatuses.every(nodeStatus => selectedNodeStatusFilter.includes(nodeStatus))) {
            n = '';
        }
        this.router.navigate([], { relativeTo: this.route, queryParams: { q, t, n } });
    }
}
