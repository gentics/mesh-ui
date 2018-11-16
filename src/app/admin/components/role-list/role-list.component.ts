import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'gentics-ui-core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { MeshDialogsService } from '../../../core/providers/dialogs/mesh-dialogs.service';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { observeQueryParam } from '../../../shared/common/observe-query-param';
import { setQueryParams } from '../../../shared/common/set-query-param';
import {
    AdminRoleEffectsService,
    AdminRoleListResponse,
    AdminRolePermissionResponse,
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
            .takeUntil(this.destroy$)
            .flatMap(([page, query, role]) => this.adminRoleEffects.loadRoles(page, query))
            .subscribe(response => {
                this.response = response;
                this.change.markForCheck();
            });

        observeQueryParam(this.route.queryParamMap, 'q', '')
            .takeUntil(this.destroy$)
            .subscribe(filterTerm => {
                this.filterInput.setValue(filterTerm, { emitEvent: false });
            });

        this.filterInput.valueChanges
            .debounceTime(300)
            .takeUntil(this.destroy$)
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

    addPermissionsToRole(roles: AdminRoleResponse[], role: AdminRolePermissionResponse): void {
        this.adminRoleEffects.addPermissionsToRole(roles, role).subscribe(() => this.refetch());
    }

    removePermissionsFromRole(roles: AdminRoleResponse[], role: AdminRolePermissionResponse): void {
        this.adminRoleEffects.removePermissionsFromRole(roles, role).subscribe(() => this.refetch());
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

    /*     removePermissionFromRole(role: AdminRoleResponse, permission: AdminRolePermissionResponse) {
        this.adminRoleEffects.removePermissionsFromRole([permission], role).subscribe(() => this.refetch());
    }

    addPermissionToRole(role: AdminRoleResponse, permission: AdminRolePermissionResponse) {
        this.adminRoleEffects.addPermissionsToRole([permission], role).subscribe(() => this.refetch());
    } */

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
        },
        allRoles: {
            elements: []
        }
    };
}
