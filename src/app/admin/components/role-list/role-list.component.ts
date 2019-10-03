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
    AdminRoleEffectsService,
    AdminRoleListResponse,
    AdminRoleResponse
} from '../../providers/effects/admin-role-effects.service';

@Component({
    selector: 'mesh-role-list',
    templateUrl: './role-list.component.html',
    styleUrls: ['./role-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleListComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    private refetch$ = new BehaviorSubject<void>(undefined);

    response: AdminRoleListResponse = emptyResponse();
    currentPage: number;
    selectedItems: AdminRoleResponse[] = [];
    filterTerm = '';
    filterInput = new FormControl('');
    filterRoleSelect = new FormControl('');

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private adminRoleEffects: AdminRoleEffectsService,
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
                flatMap(([page, query, role]) => this.adminRoleEffects.loadRoles(page, query))
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
     * Causes the roles to be refetched.
     */
    private refetch() {
        this.refetch$.next(undefined);
    }

    onPageChange(newPage: number): void {
        setQueryParams(this.router, this.route, { p: newPage });
    }

    async deleteRoles(roles: AdminRoleResponse[]) {
        if (roles.length === 0) {
            return;
        }
        await this.meshDialog.deleteConfirmation(
            { token: 'admin.delete_selected_roles', params: { count: roles.length } },
            { token: 'admin.delete_selected_roles_confirmation', params: { count: roles.length } }
        );
        this.adminRoleEffects.deleteRoles(roles).subscribe(() => {
            this.refetch();
            this.selectedItems = [];
        });
    }

    async deleteRole(role: AdminRoleResponse) {
        await this.meshDialog.deleteConfirmation(
            { token: 'admin.delete_role' },
            { token: 'admin.delete_role_confirmation', params: { rolename: role.name } }
        );
        this.adminRoleEffects.deleteRoles([role]).subscribe(() => {
            this.refetch();
            this.selectedItems = this.selectedItems.filter(item => item.uuid !== role.uuid);
        });
    }
}

function emptyResponse(): AdminRoleListResponse {
    return {
        roles: {
            currentPage: 1,
            totalCount: 0,
            elements: []
        }
    };
}
