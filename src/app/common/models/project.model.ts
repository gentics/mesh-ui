import { MicroschemaReference, SchemaReference } from './common.model';
import { ProjectResponse } from './server-models';

export interface Project extends ProjectResponse {
    // TODO: move to distinct interface
    schemas?: SchemaReference[];
    // TODO: move to distinct interface
    microschemas?: MicroschemaReference[];
}
