import { Injectable } from '@angular/core';
import * as Quill from 'quill';
import * as quillTable from 'quill-table';

import MeshLink from './formats/mesh-link';

@Injectable()
export class QuillInitializerService {
    constructor() {}

    private initialized = false;
    public initQuill() {
        if (!this.initialized) {
            this.initialized = true;
            Quill.register('formats/mesh-link', MeshLink);
            Quill.register(quillTable.TableCell);
            Quill.register(quillTable.TableRow);
            Quill.register(quillTable.Table);
            Quill.register(quillTable.Contain);
            Quill.register('modules/table', quillTable.TableModule);
        }
    }
}
