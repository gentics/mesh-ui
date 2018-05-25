import { SchemaReference } from './common.model';
import { ProjectResponse } from './server-models';

export interface Project extends ProjectResponse {
    // TODO: move to distinct interface
    schemas?: SchemaReference[];
}
