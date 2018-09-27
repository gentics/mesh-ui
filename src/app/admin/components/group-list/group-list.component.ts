import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { observeQueryParam } from '../../../shared/common/observe-query-param';
import { setQueryParams } from '../../../shared/common/set-query-param';
import {
    AdminGroupEffectsService,
    AdminGroupListResponse,
    AdminGroupResponse,
    AdminGroupRoleResponse
} from '../../providers/effects/admin-group-effects.service';

@Component({
    selector: 'mesh-group-list',
    templateUrl: './group-list.component.html',
    styleUrls: ['./group-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupListComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    private refetch$ = new BehaviorSubject<void>(undefined);

    response: AdminGroupListResponse = emptyResponse();
    currentPage: number;
    selectedIndices: number[] = [];

    filterRoleSelect = new FormControl('');

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private adminGroupEffects: AdminGroupEffectsService,
        private change: ChangeDetectorRef
    ) {}

    ngOnInit() {
        observeQueryParam(this.route.queryParamMap, 'p', 1).subscribe(page => {
            this.currentPage = page;
        });

        combineLatest(
            observeQueryParam(this.route.queryParamMap, 'p', 1),
            observeQueryParam(this.route.queryParamMap, 'q', ''),
            observeQueryParam(this.route.queryParamMap, 'role', ''),
            this.refetch$
        )
            .takeUntil(this.destroy$)
            .flatMap(([page, query, role]) => this.adminGroupEffects.loadGroups(page))
            .subscribe(response => {
                this.response = response;
                this.change.markForCheck();
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Causes the groups to be refetched.
     */
    private refetch() {
        this.refetch$.next(undefined);
    }

    onPageChange(newPage: number): void {
        setQueryParams(this.router, this.route, { p: newPage });
    }

    addGroupsToRole(selectedIndices: number[], role: AdminGroupRoleResponse): void {
        const groups = this.selectedGroupsFromIndices(selectedIndices);

        this.adminGroupEffects.addGroupsToRole(groups, role).subscribe(() => this.refetch());
    }

    removeGroupsFromRole(selectedIndices: number[], role: AdminGroupRoleResponse): void {
        const groups = this.selectedGroupsFromIndices(selectedIndices);

        this.adminGroupEffects.removeGroupsFromRole(groups, role).subscribe(() => this.refetch());
    }

    deleteGroups(selectedIndices: number[]) {
        const groups = this.selectedGroupsFromIndices(selectedIndices);

        this.adminGroupEffects.deleteGroups(groups).subscribe(() => this.refetch());
    }

    removeGroupFromRole(group: AdminGroupResponse, role: AdminGroupRoleResponse) {
        this.adminGroupEffects.removeGroupsFromRole([group], role).subscribe(() => this.refetch());
    }

    addGroupToRole(group: AdminGroupResponse, role: AdminGroupRoleResponse) {
        this.adminGroupEffects.addGroupsToRole([group], role).subscribe(() => this.refetch());
    }

    deleteGroup(group: AdminGroupResponse) {
        this.adminGroupEffects.deleteGroups([group]).subscribe(() => this.refetch());
    }

    private selectedGroupsFromIndices(indices: number[]) {
        return indices.map(i => this.response.groups.elements[i]);
    }
}

function emptyResponse(): AdminGroupListResponse {
    return {
        groups: {
            currentPage: 1,
            pageCount: 0,
            elements: []
        },
        allRoles: {
            elements: []
        }
    };
}
