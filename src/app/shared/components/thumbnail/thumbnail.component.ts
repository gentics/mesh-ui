import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { MeshNode, NodeFieldBinary } from '../../../common/models/node.model';
import { Schema, SchemaField } from '../../../common/models/schema.model';
import { isImageField, filenameExtension, queryString } from '../../../common/util/util';

/**
 * Thumbnail component for displaying node references or fields in a node.
 * # Inputs:
 * * nodeUuid (required): The node to display the the thumbnail of
 * * fieldName (optional): The field to display the preview of.
 * Is none is provided, one is choosen by certain rules. See method getBinaryProperties for more details.
 * * width: The width of the thumbnail.
 * If neither width nor height is provided, this will default to 128.
 * * height: The height of the thumbnail.
 * If neither width nor height is provided, this will default to be undefined (will be calculated by aspect ratio).
 */
@Component({
    selector: 'thumbnail',
    templateUrl: './thumbnail.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThumbnailComponent implements OnInit, OnDestroy, OnChanges {
    @Input()
    nodeUuid: string;

    @Input()
    fieldName?: string;

    @Input()
    width?: number;

    @Input()
    height?: number;

    binaryProperties: BinaryProperties = {
        type: 'noBinary'
    };

    displaySize: {
        height?: string | null;
        width?: string | null;
    };

    subscription: Subscription;

    constructor(private state: ApplicationStateService) {
    }

    ngOnInit(): void {
        let node$ = this.state.select(state => state.entities.node[this.nodeUuid])
            // Does not emit node if it was not found
            .filter(node => !!node);
        let schema$ = node$.switchMap(node => this.state.select(state => state.entities.schema[node.schema.uuid]));

        // Update binary properties when node or schema changes
        this.subscription = Observable.combineLatest(node$, schema$)
            .map(value => this.getBinaryProperties(value))
            .subscribe(binaryProperties => this.binaryProperties = binaryProperties);

        console.log('init', this.width, this.height);
        this.setDisplaySize();
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log('change!', changes);
        if (changes['width'] || changes['height']) {
            this.setDisplaySize();
        }
    }

    setDisplaySize() {
        if (this.width || this.height) {
            this.displaySize = {
                height: this.height ? this.height + 'px' : null,
                width: this.width ? this.width + 'px' : null
            };
        } else {
            this.displaySize = {
                width: '128px'
            };
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    /**
     * Gets all the information from a node to display the thumbnail.
     * Choosing the field follows these rules:
     * 1. If a fieldname is set in this component, that field will be chosen.
     * 2. If not, the first binary field that contains an image will be chosen.
     * 3. If there is no image, the first binary field will be chosen.
     */
    getBinaryProperties([node, schema]: [MeshNode, Schema]): BinaryProperties {
        let firstBinaryField: NodeFieldBinary | undefined;
        let firstBinaryFieldName: string | undefined;

        let firstImageField: NodeFieldBinary | undefined;
        let firstImageFieldName: string | undefined;

        let binaryProperties;

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
            binaryProperties = {
                type: 'image',
                imageUrl: this.getImageUrl(node, firstImageFieldName)
            };
        } else if (firstBinaryField) {
            binaryProperties = {
                type: 'binary',
                extension: filenameExtension(firstBinaryField.fileName)
            };
        } else {
            binaryProperties = {
                type: 'noBinary'
            };
        }

        return binaryProperties;
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

interface BinaryProperties {
    type: 'image' | 'binary' | 'noBinary';
    imageUrl?: string;
    extension?: string;
}

interface Size {
    width?: string;
    height?: string;
}
