import { ProjectResponse } from './server-models';
import { SchemaReference } from './common.model';

export interface Project extends ProjectResponse {
    // TODO: move to distinct interface
    schemas?: SchemaReference[];
}
