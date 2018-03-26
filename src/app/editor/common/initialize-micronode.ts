import { Microschema } from '../../common/models/microschema.model';
import { NodeFieldMicronode } from '../../common/models/node.model';
import { initializeFieldValue } from './initialize-field-value';

/**
 * Initializes a new Micronode based on the associated Microschema.
 *
 * TODO - verify what's the version number for NodeFieldMicronode.microschema
 */
export function initializeMicronode(microschema: Microschema): NodeFieldMicronode {
    const micronode: NodeFieldMicronode = {
        uuid: '',
        microschema: {
            name: microschema.name,
            uuid: microschema.uuid,
            version: '0.0'
        },
        fields: {}
    };

    for (const field of microschema.fields) {
        micronode.fields[field.name] = initializeFieldValue(field);
    }

    return micronode;
}
