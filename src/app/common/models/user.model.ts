import { PermissionInfoFromServer, UserReferenceFromServer, UserResponse } from './server-models';

export interface User extends UserResponse {
    // TODO: these should not be needed after resolving https://github.com/gentics/mesh-model-generator/issues/13
    editor: UserReferenceFromServer;
    rolePerms: PermissionInfoFromServer;
}
