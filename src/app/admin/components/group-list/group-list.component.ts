import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'gentics-ui-core';
import { combineLatest, BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, flatMap, takeUntil } from 'rxjs/operators';

import { MeshDialogsService } from '../../../core/providers/dialogs/mesh-dialogs.service';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
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
    selectedItems: AdminGroupResponse[] = [];
    filterTerm = '';
    filterInput = new FormControl('');
    filterRoleSelect = new FormControl('');

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private adminGroupEffects: AdminGroupEffectsService,
        private change: ChangeDetectorRef,
        private meshDialog: MeshDialogsService
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
            .pipe(
                takeUntil(this.destroy$),
                flatMap(([page, query, role]) => this.adminGroupEffects.loadGroups(page, query))
            )
            .subscribe(response => {
                this.response = response;
                this.change.markForCheck();
            });

        observeQueryParam(this.route.queryParamMap, 'q', '')
            .pipe(takeUntil(this.destroy$))
            .subscribe(filterTerm => {
                this.filterInput.setValue(filterTerm, { emitEvent: false });
            });

        this.filterInput.valueChanges
            .pipe(
                debounceTime(300),
                takeUntil(this.destroy$)
            )
            .subscribe(term => {
                setQueryParams(this.router, this.route, { q: term });
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

    addGroupsToRole(groups: AdminGroupResponse[], role: AdminGroupRoleResponse): void {
        this.adminGroupEffects.addGroupsToRole(groups, role).subscribe(() => this.refetch());
    }

    removeGroupsFromRole(groups: AdminGroupResponse[], role: AdminGroupRoleResponse): void {
        this.adminGroupEffects.removeGroupsFromRole(groups, role).subscribe(() => this.refetch());
    }

    async deleteGroups(groups: AdminGroupResponse[]) {
        if (groups.length === 0) {
            return;
        }
        await this.meshDialog.deleteConfirmation(
            { token: 'admin.delete_selected_groups', params: { count: groups.length } },
            { token: 'admin.delete_selected_groups_confirmation', params: { count: groups.length } }
        );
        this.adminGroupEffects.deleteGroups(groups).subscribe(() => {
            this.refetch();
            this.selectedItems = [];
        });
    }

    removeGroupFromRole(group: AdminGroupResponse, role: AdminGroupRoleResponse) {
        this.adminGroupEffects.removeGroupsFromRole([group], role).subscribe(() => this.refetch());
    }

    addGroupToRole(group: AdminGroupResponse, role: AdminGroupRoleResponse) {
        this.adminGroupEffects.addGroupsToRole([group], role).subscribe(() => this.refetch());
    }

    async deleteGroup(group: AdminGroupResponse) {
        await this.meshDialog.deleteConfirmation(
            { token: 'admin.delete_group' },
            { token: 'admin.delete_group_confirmation', params: { groupname: group.name } }
        );
        this.adminGroupEffects.deleteGroups([group]).subscribe(() => {
            this.refetch();
            this.selectedItems = this.selectedItems.filter(item => item.uuid !== group.uuid);
        });
    }
}

function emptyResponse(): AdminGroupListResponse {
    return {
        groups: {
            currentPage: 1,
            totalCount: 0,
            elements: []
        },
        allRoles: {
            elements: []
        }
    };
}
