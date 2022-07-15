import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable, Subject } from 'rxjs';
import { debounceTime, map, takeUntil } from 'rxjs/operators';
import { SanitizerService } from 'src/app/core/providers/sanitizer/sanitizer.service';

import { ADMIN_GROUP_NAME, ADMIN_USER_NAME } from '../../../common/constants';
import { Group } from '../../../common/models/group.model';
import { User } from '../../../common/models/user.model';
import { fuzzyMatch } from '../../../common/util/fuzzy-search';
import { notNullOrUndefined } from '../../../common/util/util';
import { MeshDialogsService } from '../../../core/providers/dialogs/mesh-dialogs.service';
import { observeQueryParam } from '../../../shared/common/observe-query-param';
import { setQueryParams } from '../../../shared/common/set-query-param';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { EntitiesService } from '../../../state/providers/entities.service';
import { AdminUserEffectsService } from '../../providers/effects/admin-user-effects.service';

@Component({
    selector: 'mesh-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent implements OnInit, OnDestroy {
    users$: Observable<User[]>;
    currentPage$: Observable<number>;
    itemsPerPage$: Observable<number>;
    totalItems$: Observable<number | null>;
    allGroups$: Observable<Group[]>;
    filterInput = new FormControl('');
    filterGroupSelect = new FormControl('');
    filterTerm = '';
    selectedUsers: User[] = [];
    ADMIN_USER_NAME = ADMIN_USER_NAME;
    ADMIN_GROUP_NAME = ADMIN_GROUP_NAME;

    private destroy$ = new Subject<void>();

    constructor(
        private state: ApplicationStateService,
        private entities: EntitiesService,
        private route: ActivatedRoute,
        private router: Router,
        private meshDialog: MeshDialogsService,
        private adminUserEffects: AdminUserEffectsService,
        private sanitizer: SanitizerService
    ) {}

    ngOnInit() {
        this.adminUserEffects.loadAllUsers();
        this.adminUserEffects.loadAllGroups();

        combineLatest(
            observeQueryParam(this.route.queryParamMap, 'p', 1),
            observeQueryParam(this.route.queryParamMap, 'perPage', 25)
        )
            .pipe(takeUntil(this.destroy$))
            .subscribe(([page, perPage]) => {
                this.adminUserEffects.setListPagination(page, perPage);
            });

        observeQueryParam(this.route.queryParamMap, 'q', '')
            .pipe(takeUntil(this.destroy$))
            .subscribe(filterTerm => {
                this.adminUserEffects.setFilterTerm(filterTerm);
                this.filterInput.setValue(filterTerm, { emitEvent: false });
            });

        observeQueryParam(this.route.queryParamMap, 'group', '')
            .pipe(takeUntil(this.destroy$))
            .subscribe(groupUuid => {
                this.adminUserEffects.setFilterGroups([groupUuid]);

                // setTimeout prevent an error where the Select component has not yet
                // got a reference to the <gtx-option> elements at init time, which prevents
                // the default value from being selected.
                setTimeout(() => {
                    this.filterGroupSelect.setValue(groupUuid, { emitEvent: false });
                });
            });

        this.filterInput.valueChanges
            .pipe(
                debounceTime(300),
                takeUntil(this.destroy$)
            )
            .subscribe(term => {
                setQueryParams(this.router, this.route, { q: term });
            });

        this.filterGroupSelect.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(groupUuid => {
            setQueryParams(this.router, this.route, { group: groupUuid });
        });

        const allUsers$ = this.state
            .select(state => state.adminUsers.userList)
            .pipe(map(uuids => uuids.map(uuid => this.entities.getUser(uuid)).filter(notNullOrUndefined)));
        const filterTerm$ = this.state.select(state => state.adminUsers.filterTerm);
        const filterGroups$ = this.state.select(state => state.adminUsers.filterGroups);

        this.users$ = combineLatest(allUsers$, filterTerm$, filterGroups$).pipe(
            map(([users, filterTerm, filterGroups]) => this.filterUsers(users, filterTerm, filterGroups))
        );

        this.allGroups$ = this.entities.selectAllGroups();
        this.currentPage$ = this.state.select(state => state.adminUsers.pagination.currentPage);
        this.itemsPerPage$ = this.state.select(state => state.adminUsers.pagination.itemsPerPage);
        this.totalItems$ = this.state.select(state => state.adminUsers.pagination.totalItems);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onPageChange(newPage: number): void {
        setQueryParams(this.router, this.route, { p: newPage });
    }

    deleteUser(user: User): void {
        if (!user.permissions.delete || user.username === ADMIN_USER_NAME) {
            return;
        }
        this.meshDialog
            .deleteConfirmation(
                { token: 'admin.delete_user' },
                {
                    token: 'admin.delete_user_confirmation',
                    params: {
                        username: this.sanitizer.sanitizeHTML(user.username)
                    }
                }
            )
            .then(() => {
                this.adminUserEffects.deleteUser(user);
            });
    }

    async deleteUsers(selectedUsers: User[]) {
        // check permissions
        const deletableUsers = selectedUsers.filter(
            user => user.permissions.delete && user.username !== ADMIN_USER_NAME
        );
        // if users to delete exist
        if (deletableUsers.length === 0) {
            return;
        } else {
            // prompt modal to be confirmed by user
            await this.meshDialog.deleteConfirmation(
                { token: 'admin.delete_selected_users', params: { count: deletableUsers.length } },
                {
                    token: 'admin.delete_selected_users_confirmation',
                    params: { count: deletableUsers.length }
                }
            );
            // send delete requests
            deletableUsers.forEach(user => {
                this.adminUserEffects.deleteUser(user);
            });
            // empty selection
            this.selectedUsers = [];
        }
    }

    addUserToGroup(user: User, group: Group): void {
        this.adminUserEffects.addUserToGroup(user, group.uuid);
    }

    removeUserFromGroup(user: User, group: Group): void {
        this.adminUserEffects.removeUserFromGroup(user, group.uuid);
    }

    addUsersToGroup(selectedUsers: User[], group: Group): void {
        this.adminUserEffects.addUsersToGroup(selectedUsers, group.uuid);
    }

    removeUsersFromGroup(selectedUsers: User[], group: Group): void {
        this.adminUserEffects.removeUsersFromGroup(selectedUsers, group.uuid);
    }

    private filterUsers(users: User[], filterTerm: string, filterGroups: string[]): User[] {
        const groupUuid = filterGroups[0];
        this.filterTerm = filterTerm.trim();
        if (this.filterTerm === '' && !groupUuid) {
            return users;
        }
        return users.filter(user => this.userMatchesTerm(user, this.filterTerm) && this.userIsInGroup(user, groupUuid));
    }

    private userMatchesTerm(user: User, filterTerm: string): boolean {
        return fuzzyMatch(filterTerm, `${user.firstname} ${user.lastname} ${user.username}`) !== null;
    }

    private userIsInGroup(user: User, groupUuid: string | undefined): boolean {
        if (!groupUuid) {
            return true;
        }
        return user.groups.some(group => group.uuid === groupUuid);
    }
}
