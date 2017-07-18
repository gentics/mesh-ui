import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SchemaReference } from '../../../common/models/common.model';
import { Schema } from '../../../common/models/schema.model';

@Component({
    selector: 'schema-label',
    templateUrl: './schema-label.component.html',
    styleUrls: ['./schema-label.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SchemaLabelComponent {
    @Input() schema: SchemaReference | Schema;

    getSchemaName(): string {
        return this.schema.name || this.schema.uuid;
    }
}
