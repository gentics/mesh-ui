import { ApiBase } from './api-base.service';
import { apiDelete, apiGet, apiPost, apiPostWithoutBody } from './api-methods';


export class UserApi {
    constructor(private apiBase: ApiBase) { }

    /** Deactivate the user with the given uuid. */
    deactivateUser = apiDelete('/users/{userUuid}');

    /** Delete the group with the given uuid */
    deleteGroup = apiDelete('/groups/{groupUuid}');

    /** Delete the role with the given uuid */
    deleteRole = apiDelete('/roles/{roleUuid}');

    /** Load the group with the given uuid. */
    getGroup = apiGet('/groups/{groupUuid}');

    /** Get a list of groups as a paged response. */
    getGroups = apiGet('/groups');

    /** Load the role with the given uuid. */
    getRole = apiGet('/roles/{roleUuid}');

    /** Load the permissions between given role and the targeted element. */
    getRolePermissionsForPath = apiGet('/roles/{roleUuid}/permissions/{pathToElement}');

    /** Get a list of roles as a paged list response */
    getRoles = apiGet('/roles');

    /** Load multiple roles that are assigned to the group. Return a paged list response. */
    getRolesOfGroup = apiGet('/groups/{groupUuid}/roles');

    /** Get the user with the given uuid */
    getUser = apiGet('/users/{userUuid}');

    /** Get the user permissions on the element(s) that are located by the specified path. */
    getUserPermissionsForPath = apiGet('/users/{userUuid}/permissions/{path}');

    /** Get a list of users as a paged list response. */
    getUsers = apiGet('/users');

    /** Load a list of users which have been assigned to the group. */
    getUsersOfGroup = apiGet('/groups/{groupUuid}/users');

    /** Generate an API token which can be used to authenticate the user. */
    generateApiToken = apiPostWithoutBody('/users/{userUuid}/token');

    /** Generate a one-time token which can be used by any user to update a user (e.g. to reset the password). */
    generateResetToken = apiPostWithoutBody('/users/{userUuid}/reset_token');

    /** Invoke a search query for groups and return a paged list response. */
    // TODO: This is typed wrong in the RAML.
    searchGroups = apiPost('/search/groups');

    /** Invoke a search query for roles and return a paged list response. */
    // TODO: This is typed wrong in the RAML.
    searchRoles = apiPost('/search/roles');

    /** Invoke a search query for users and return a paged list response. */
    // TODO: This is typed wrong in the RAML.
    searchUsers = apiPost('/search/users');
}
