import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { MeshNode, NodeFieldBinary } from '../../../common/models/node.model';
import { Schema, SchemaField } from '../../../common/models/schema.model';
import { isImageField, filenameExtension, queryString } from '../../../util';

@Component({
    selector: 'thumbnail',
    templateUrl: './thumbnail.component.html'
})
export class ThumbnailComponent implements OnInit {
    @Input()
    nodeUuid: string;

    @Input()
    fieldName: string;

    @Input()
    width: number;

    @Input()
    height: number;

    binaryProperties: {
        isImage: boolean;
        isBinary: boolean;
        imageUrl?: string;
        extension?: string;
    };

    constructor(private state: ApplicationStateService) {
    }

    ngOnInit(): void {
        let node$ = this.state.select(state => state.entities.node[this.nodeUuid]);
        let schema$ = node$.switchMap(node => this.state.select(state => state.entities.schema[node.schema.uuid]));

        // Update binary properties when node or schema changes
        Observable.combineLatest(node$, schema$).subscribe(value => this.setBinaryProperties(value));
    }


    /**
     * Gets all the information from a node to display the thumbnail.
     * Choosing the field follows these rules:
     * 1. If a fieldname is set in this component, that field will be chosen.
     * 2. If not, the first binary field that contains an image will be chosen.
     * 3. If there is no image, the first binary field will be chosen.
     */
    setBinaryProperties([node, schema]: [MeshNode, Schema]): void {
        let firstBinaryField: NodeFieldBinary | undefined;
        let firstBinaryFieldName: string | undefined;

        let firstImageField: NodeFieldBinary | undefined;
        let firstImageFieldName: string | undefined;

        schema.fields
            .filter(field => this.binaryFilter(field))
            .forEach(field => {
                let nodeField: NodeFieldBinary = node.fields[field.name] as NodeFieldBinary;
                if (!firstBinaryField) {
                    firstBinaryField = nodeField;
                    firstBinaryFieldName = field.name;
                }
                if (!firstImageField && isImageField(nodeField)) {
                    firstImageField = nodeField;
                    firstImageFieldName = field.name;
                }
            });

        if (firstImageField && firstImageFieldName) {
            this.binaryProperties = {
                isImage: true,
                isBinary: true,
                imageUrl: this.getImageUrl(node, firstImageFieldName)
            };
        } else if (firstBinaryField) {
            this.binaryProperties = {
                isImage: false,
                isBinary: true,
                extension: filenameExtension(firstBinaryField.fileName)
            };
        } else {
            this.binaryProperties = {
                isImage: false,
                isBinary: false
            };
        }
    }

    /**
     * Filters by component field name, or if it is not set, by binary fields.
     */
    binaryFilter(field: SchemaField): boolean {
        return this.fieldName ? field.name === this.fieldName && field.type === 'binary' : field.type === 'binary';
    }

    /**
     * Creates an image URL from the node and the chosen field. Also uses Mesh Image API to resize the image.
     */
    getImageUrl(node: MeshNode, fieldName: string): string {
        let query = queryString({
            width: this.width,
            height: this.height
        });
        // TODO use central constant for beginning of relative URL
        return `/api/v1/${node.project.name}/nodes/${node.uuid}/binary/${fieldName}${query}`;
    }
}
