import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { BinaryField, MeshNode } from '../../../common/models/node.model';
import { Schema, SchemaField } from '../../../common/models/schema.model';
import { filenameExtension, isImageField, queryString } from '../../../common/util/util';
import { EntitiesService } from '../../../state/providers/entities.service';

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
    selector: 'mesh-thumbnail',
    templateUrl: './thumbnail.component.html'
})
export class ThumbnailComponent implements OnInit, OnDestroy, OnChanges {
    @Input() nodeUuid: string;

    @Input() fieldName?: string;

    @Input() width?: number;

    @Input() height?: number;

    binaryProperties: BinaryProperties = {
        type: 'noBinary'
    };

    displaySize: {
        height?: string | null;
        width?: string | null;
    };

    private subscription: Subscription;

    constructor(private changeDetector: ChangeDetectorRef, private entities: EntitiesService) {}

    ngOnInit(): void {
        this.setDisplaySize();
    }

    ngOnChanges(changes: SimpleChanges): void {
        const node$ = this.entities
            .selectNode(this.nodeUuid, { strictLanguageMatch: false })
            // Does not emit node if it was not found
            .filter(node => !!node);
        const schema$ = node$.switchMap(node => this.entities.selectSchema(node.schema.uuid!));

        this.subscription = Observable.combineLatest(node$, schema$)
            .map(value => this.getBinaryProperties(value))
            .subscribe(binaryProperties => {
                this.binaryProperties = binaryProperties;
                this.changeDetector.detectChanges();
            });

        if (changes['width'] || changes['height']) {
            this.setDisplaySize();
        }
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    private setDisplaySize() {
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

    /**
     * Gets all the information from a node to display the thumbnail.
     * Choosing the field follows these rules:
     * 1. If a fieldname is set in this component, that field will be chosen.
     * 2. If not, the first binary field that contains an image will be chosen.
     * 3. If there is no image, the first binary field will be chosen.
     */
    private getBinaryProperties([node, schema]: [MeshNode, Schema]): BinaryProperties {
        let firstBinaryField: BinaryField | undefined;
        let firstBinaryFieldName: string | undefined;

        let firstImageField: BinaryField | undefined;
        let firstImageFieldName: string | undefined;

        let binaryProperties: BinaryProperties;

        schema.fields.filter(field => this.binaryFilter(field)).forEach(field => {
            // TODO Remove exclamation mark as soon as mesh typing is fixed
            const nodeField: BinaryField = node.fields[field.name!] as BinaryField;
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
    private binaryFilter(field: SchemaField): boolean {
        return this.fieldName ? field.name === this.fieldName && field.type === 'binary' : field.type === 'binary';
    }

    /**
     * Creates an image URL from the node and the chosen field. Also uses Mesh Image API to resize the image.
     */
    private getImageUrl(node: MeshNode, fieldName: string): string {
        const query = queryString({
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
