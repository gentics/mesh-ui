import { Observable } from 'rxjs/Observable';

import { ApiBase } from './api-base.service';
import { apiGetMethod, apiDeleteMethod, apiPostMethod, apiPostMethodWithBody } from './api-methods';


export class UserApi {
    constructor(private apiBase: ApiBase) { }

    /** Deactivate the user with the given uuid. */
    deactivateUser = apiDeleteMethod('/users/{userUuid}');

    /** Delete the group with the given uuid */
    deleteGroup = apiDeleteMethod('/groups/{groupUuid}');

    /** Delete the role with the given uuid */
    deleteRole = apiDeleteMethod('/roles/{roleUuid}');

    /** Load the group with the given uuid. */
    getGroup = apiGetMethod('/groups/{groupUuid}');

    /** Get a list of groups as a paged response. */
    getGroups = apiGetMethod('/groups');

    /** Load the role with the given uuid. */
    getRole = apiGetMethod('/roles/{roleUuid}');

    /** Load the permissions between given role and the targeted element. */
    getRolePermissionsForPath = apiGetMethod('/roles/{roleUuid}/permissions/{pathToElement}');

    /** Get a list of roles as a paged list response */
    getRoles = apiGetMethod('/roles');

    /** Load multiple roles that are assigned to the group. Return a paged list response. */
    getRolesOfGroup = apiGetMethod('/groups/{groupUuid}/roles');

    /** Get the user with the given uuid */
    getUser = apiGetMethod('/users/{userUuid}');

    /** Get the user permissions on the element(s) that are located by the specified path. */
    getUserPermissionsForPath = apiGetMethod('/users/{userUuid}/permissions/{path}');

    /** Get a list of users as a paged list response. */
    getUsers = apiGetMethod('/users');

    /** Load a list of users which have been assigned to the group. */
    getUsersOfGroup = apiGetMethod('/groups/{groupUuid}/users');

    /** Generate an API token which can be used to authenticate the user. */
    generateApiToken = apiPostMethod('/users/{userUuid}/token');

    /** Generate a one-time token which can be used by any user to update a user (e.g. to reset the password). */
    generateResetToken = apiPostMethod('/users/{userUuid}/reset_token');

    /** Invoke a search query for groups and return a paged list response. */
    // TODO: This is typed wrong in the RAML.
    searchGroups = apiPostMethodWithBody('/search/groups');

    /** Invoke a search query for roles and return a paged list response. */
    // TODO: This is typed wrong in the RAML.
    searchRoles = apiPostMethodWithBody('/search/roles');

    /** Invoke a search query for users and return a paged list response. */
    // TODO: This is typed wrong in the RAML.
    searchUsers = apiPostMethodWithBody('/search/users');
}
