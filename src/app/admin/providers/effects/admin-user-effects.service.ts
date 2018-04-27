import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../../../core/providers/api/api.service';
import { I18nNotification } from '../../../core/providers/i18n-notification/i18n-notification.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { UserCreateRequest, UserResponse, UserUpdateRequest } from '../../../common/models/server-models';
import { User } from '../../../common/models/user.model';
import { Schema } from '../../../common/models/schema.model';
import { MeshNode } from '../../../common/models/node.model';


@Injectable()
export class AdminUserEffectsService {

    constructor(private api: ApiService,
                private notification: I18nNotification,
                private state: ApplicationStateService) {
    }

    loadUsers(page: number, perPage: number): void {
        this.state.actions.adminUsers.fetchUsersStart();

        this.api.user.getUsers({ page, perPage })
            .subscribe(
                response => {
                    this.state.actions.adminUsers.fetchUsersSuccess(response);
                },
                error => {
                    this.state.actions.adminUsers.fetchUsersError();
                }
            );
    }

    /**
     * Loads *all* users, not paginated. This is used because there is currently no facility to filter
     * users on the server-side in Mesh. Once this capability is implemented in Mesh (e.g. via the Graphql endpoint)
     * then we should switch to server-side paging to avoid perf issues on instances with many (thousands or millions) of users.
     */
    loadAllUsers(): void {
        this.state.actions.adminUsers.fetchUsersStart();

        this.api.user.getUsers({ page: 1, perPage: 9999999 })
            .subscribe(
                response => {
                    this.state.actions.adminUsers.fetchUsersSuccess(response);
                },
                error => {
                    this.state.actions.adminUsers.fetchUsersError();
                }
            );
    }

    loadAllGroups(): void {
        this.state.actions.adminUsers.fetchAllGroupsStart();

        this.api.user.getGroups({ page: 1, perPage: 9999999 })
            .subscribe(
                response => {
                    this.state.actions.adminUsers.fetchAllGroupsSuccess(response.data);
                },
                error => {
                    this.state.actions.adminUsers.fetchAllGroupsError();
                });
    }

    /**
     * This is only needed when using client-side pagination. See note above loadAllUsers().
     */
    setListPagination(currentPage: number, itemsPerPage: number): void {
        this.state.actions.adminUsers.setUserListPagination(currentPage, itemsPerPage);
    }

    setFilterTerm(term: string): void {
        this.state.actions.adminUsers.setFilterTerm(term);
    }

    setFilterGroups(groups: string[]): void {
        this.state.actions.adminUsers.setFilterGroups(groups);
    }

    newUser(): void {
        this.state.actions.adminUsers.newUser();
    }

    openUser(uuid: string): Promise<User | void> {
        this.state.actions.adminUsers.openUserStart();

        return this.api.user.getUser({ userUuid: uuid})
            .flatMap<UserResponse, [User, MeshNode | undefined, Schema | undefined]>((userResponse: User) => {
                if (userResponse.nodeReference) {
                    const { uuid: nodeUuid, projectName, schema } = userResponse.nodeReference;
                    return forkJoin(
                        Observable.of(userResponse),
                        this.api.project.getNode({ nodeUuid, project: projectName }),
                        this.api.admin.getSchema({ schemaUuid: schema.uuid })
                    );
                } else {
                    return [[userResponse, undefined, undefined]];
                }
            })
            .toPromise()
            .then(
                ([user, node, schema]) => {
                    this.state.actions.adminUsers.openUserSuccess(user, node, schema);
                    return user;
                },
                error => {
                    this.state.actions.adminUsers.openUserError();
                }
            );
    }

    createUser(userRequest: UserCreateRequest): Promise<UserResponse> {
        this.state.actions.adminUsers.createUserStart();
        return this.api.admin.createUser({}, userRequest)
            .do(
                user => {
                    this.state.actions.adminUsers.createUserSuccess(user);
                    this.notification.show({
                        type: 'success',
                        message: 'admin.user_created'
                    });
                },
                () => this.state.actions.adminUsers.createUserError()
            )
            .toPromise();
    }

    updateUser(userUuid: string, user: UserUpdateRequest): Promise<User | void> {
        this.state.actions.adminUsers.updateUserStart();

        return this.api.admin.updateUser({ userUuid }, user)
            .toPromise()
            .then(
                response => {
                    this.state.actions.adminUsers.updateUserSuccess(response);
                    this.notification.show({
                        type: 'success',
                        message: 'admin.user_updated'
                    });
                    return response as User;
                },
                error => this.state.actions.adminUsers.updateUserError()
            );
    }

    deleteUser(user: User): void {
        this.state.actions.adminUsers.deleteUserStart();

        this.api.admin.deactivateUser({ userUuid: user.uuid })
        .subscribe(() => {
            this.state.actions.adminUsers.deleteUserSuccess(user.uuid);
            this.notification.show({
                type: 'success',
                message: 'admin.user_deleted',
                translationParams: { username: user.username }
            });
        }, error => {
            this.state.actions.adminUsers.deleteUserError();
            this.notification.show({
                type: 'error',
                message: 'admin.user_deleted_error',
                translationParams: { username: user.username }
            });
        });
    }

    addUserToGroup(user: User, groupUuid: string): void {
        this.state.actions.adminUsers.addUserToGroupStart();

        this.api.admin.addUserToGroup({ userUuid: user.uuid, groupUuid })
            .subscribe(
                group => {
                    user.groups.push({
                        name: group.name,
                        uuid: group.uuid
                    });
                    this.state.actions.adminUsers.addUserToGroupSuccess(user);
                },
                error => {
                    this.state.actions.adminUsers.addUserToGroupError();
                });
    }


    addUsersToGroup(users: User[], groupUuid: string): void {
        const usersNotAlreadyInGroup = users.filter(user => {
            return !user.groups.map(group => group.uuid).includes(groupUuid);
        });

        usersNotAlreadyInGroup.forEach(user => {
            this.addUserToGroup(user, groupUuid);
        });
    }

    removeUserFromGroup(user: User, groupUuid: string): void {
        this.state.actions.adminUsers.removeUserFromGroupStart();

        this.api.admin.removeUserFromGroup({ userUuid: user.uuid, groupUuid })
            .subscribe(
                () => {
                    const index = user.groups.findIndex(g => g.uuid === groupUuid);
                    if (-1 < index) {
                        user.groups.splice(index, 1);
                    }
                    this.state.actions.adminUsers.removeUserFromGroupSuccess(user);
                },
                error => {
                    this.state.actions.adminUsers.removeUserFromGroupError();
                });
    }

    removeUsersFromGroup(users: User[], groupUuid: string): void {
        const usersInGroup = users.filter(user => {
            return user.groups.map(group => group.uuid).includes(groupUuid);
        });

        usersInGroup.forEach(user => {
            this.removeUserFromGroup(user, groupUuid);
        });
    }
}
