import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'gentics-ui-core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { ADMIN_GROUP_NAME, ADMIN_USER_NAME } from '../../../common/constants';
import { Group } from '../../../common/models/group.model';
import { User } from '../../../common/models/user.model';
import { fuzzyMatch } from '../../../common/util/fuzzy-search';
import { notNullOrUndefined } from '../../../common/util/util';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
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
    selectedIndices: number[] = [];
    ADMIN_USER_NAME = ADMIN_USER_NAME;
    ADMIN_GROUP_NAME = ADMIN_GROUP_NAME;

    private destroy$ = new Subject<void>();

    constructor(
        private state: ApplicationStateService,
        private entities: EntitiesService,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: ModalService,
        private i18n: I18nService,
        private adminUserEffects: AdminUserEffectsService
    ) {}

    ngOnInit() {
        this.adminUserEffects.loadAllUsers();
        this.adminUserEffects.loadAllGroups();

        combineLatest(
            observeQueryParam(this.route.queryParamMap, 'p', 1),
            observeQueryParam(this.route.queryParamMap, 'perPage', 25)
        )
            .takeUntil(this.destroy$)
            .subscribe(([page, perPage]) => {
                this.adminUserEffects.setListPagination(page, perPage);
            });

        observeQueryParam(this.route.queryParamMap, 'q', '')
            .takeUntil(this.destroy$)
            .subscribe(filterTerm => {
                this.adminUserEffects.setFilterTerm(filterTerm);
                this.filterInput.setValue(filterTerm, { emitEvent: false });
            });

        observeQueryParam(this.route.queryParamMap, 'group', '')
            .takeUntil(this.destroy$)
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
            .debounceTime(300)
            .takeUntil(this.destroy$)
            .subscribe(term => {
                setQueryParams(this.router, this.route, { q: term });
            });

        this.filterGroupSelect.valueChanges.takeUntil(this.destroy$).subscribe(groupUuid => {
            setQueryParams(this.router, this.route, { group: groupUuid });
        });

        const allUsers$ = this.state
            .select(state => state.adminUsers.userList)
            .map(uuids => uuids.map(uuid => this.entities.getUser(uuid)).filter(notNullOrUndefined));
        const filterTerm$ = this.state.select(state => state.adminUsers.filterTerm);
        const filterGroups$ = this.state.select(state => state.adminUsers.filterGroups);

        this.users$ = combineLatest(allUsers$, filterTerm$, filterGroups$).map(([users, filterTerm, filterGroups]) =>
            this.filterUsers(users, filterTerm, filterGroups)
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
        this.displayDeleteUserModal(
            { token: 'admin.delete_user' },
            { token: 'admin.delete_user_confirmation', params: { username: user.username } }
        ).then(() => {
            this.adminUserEffects.deleteUser(user);
        });
    }

    deleteUsers(selectedIndices: number[]): void {
        this.selectedUsersFromIndices(selectedIndices)
            .flatMap(selectedUsers => {
                const deletableUsers = selectedUsers.filter(
                    user => user.permissions.delete && user.username !== ADMIN_USER_NAME
                );
                if (deletableUsers.length === 0) {
                    return Observable.empty<any[]>();
                } else {
                    return this.displayDeleteUserModal(
                        { token: 'admin.delete_selected_users', params: { count: deletableUsers.length } },
                        { token: 'admin.delete_selected_users_confirmation', params: { count: deletableUsers.length } }
                    ).then(() => deletableUsers);
                }
            })
            .subscribe((deletableUsers: User[]) => {
                deletableUsers.forEach(user => {
                    this.adminUserEffects.deleteUser(user);
                });
                this.selectedIndices = [];
            });
    }

    addUserToGroup(user: User, group: Group): void {
        this.adminUserEffects.addUserToGroup(user, group.uuid);
    }

    removeUserFromGroup(user: User, group: Group): void {
        this.adminUserEffects.removeUserFromGroup(user, group.uuid);
    }

    addUsersToGroup(selectedIndices: number[], group: Group): void {
        this.selectedUsersFromIndices(selectedIndices).subscribe(selectedUsers => {
            this.adminUserEffects.addUsersToGroup(selectedUsers, group.uuid);
        });
    }

    removeUsersFromGroup(selectedIndices: number[], group: Group): void {
        this.selectedUsersFromIndices(selectedIndices).subscribe(selectedUsers => {
            if (group.name === ADMIN_GROUP_NAME) {
                // Prevent the admin user from being removed from the admin group.
                selectedUsers = selectedUsers.filter(user => user.username !== ADMIN_USER_NAME);
            }
            this.adminUserEffects.removeUsersFromGroup(selectedUsers, group.uuid);
        });
    }

    private selectedUsersFromIndices(selectedIndices: number[]): Observable<User[]> {
        return this.users$.take(1).map(users => users.filter((user, index) => selectedIndices.includes(index)));
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

    private displayDeleteUserModal(
        title: { token: string; params?: { [key: string]: any } },
        body: { token: string; params?: { [key: string]: any } }
    ): Promise<any> {
        return this.modalService
            .dialog({
                title: this.i18n.translate(title.token, title.params) + '?',
                body: this.i18n.translate(body.token, body.params),
                buttons: [
                    {
                        type: 'secondary',
                        flat: true,
                        shouldReject: true,
                        label: this.i18n.translate('common.cancel_button')
                    },
                    { type: 'alert', label: this.i18n.translate('admin.delete_label') }
                ]
            })
            .then(modal => modal.open());
    }
}
