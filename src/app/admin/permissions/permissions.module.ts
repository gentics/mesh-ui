import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { CheckboxModule } from 'primeng/checkbox';
import { PaginatorModule } from 'primeng/paginator';
import { TreeTableModule } from 'primeng/treetable';

import { IconCheckboxComponent } from './icon-checkbox/icon-checkbox.component';
import { NodePermissionsComponent } from './node-permissions/node-permissions.component';
import { PermissionsComponent } from './permissions.component';
import { SimplePermissionsComponent } from './simple-permissions/simple-permissions.component';
import { TagPermissionsComponent } from './tag-permissions/tag-permissions.component';

@NgModule({
    declarations: [
        PermissionsComponent,
        IconCheckboxComponent,
        TagPermissionsComponent,
        NodePermissionsComponent,
        SimplePermissionsComponent
    ],
    imports: [AccordionModule, CheckboxModule, CommonModule, FormsModule, PaginatorModule, TreeTableModule],
    providers: []
})
export class PermissionsModule {}
