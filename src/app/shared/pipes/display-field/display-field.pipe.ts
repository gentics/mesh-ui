import { Pipe, PipeTransform } from '@angular/core';

import { MeshNode } from '../../../common/models/node.model';

/**
 * Returns a "name" for a node depending on the displayField of the schema.
 */
@Pipe({ name: 'displayField' })
export class DisplayFieldPipe implements PipeTransform {
    transform(node: MeshNode): string {
        if (!node) {
            return '';
        }
        if (!node.displayField) {
            return node.uuid;
        }

        const displayField = node.fields && node.fields[node.displayField];
        return displayField == null ? node.uuid : displayField;
    }
}
