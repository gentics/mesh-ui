import { Pipe, PipeTransform } from '@angular/core';
import { MeshNode } from 'src/app/common/models/node.model';
import { getNodeStatus } from 'src/app/common/util/node-util';

import { EMeshNodeStatusStrings } from '../../components/node-status/node-status.component';

@Pipe({ name: 'nodeStatus' })
export class NodeStatusPipe implements PipeTransform {
    transform(value: MeshNode, language: string): EMeshNodeStatusStrings | null {
        return getNodeStatus(value, language);
    }
}
