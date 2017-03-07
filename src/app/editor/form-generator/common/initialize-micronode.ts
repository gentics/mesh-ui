import { Microschema } from '../../../common/models/microschema.model';
import { NodeFieldMicronode } from '../../../common/models/node.model';
import { initializeFieldValue } from './initialize-field-value';

/**
 * Initializes a new Micronode based on the associated Microschema.
 */
export function initializeMicronode(microschema: Microschema): NodeFieldMicronode {
    const micronode = {
        uuid: '',
        microschema: {
            name: microschema.name,
            uuid: microschema.uuid
        },
        fields: {}
    };

    for (let field of microschema.fields) {
        micronode.fields[field.name] = initializeFieldValue(field);
    }

    return micronode;
}
