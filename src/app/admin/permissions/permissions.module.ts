import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { PaginatorModule } from 'primeng/paginator';
import { TreeTableModule } from 'primeng/treetable';

import { SharedModule } from '../../shared/shared.module';

import { NodePermissionsComponent } from './node-permissions/node-permissions.component';
import { PermissionsComponent } from './permissions.component';
import { SimplePermissionsComponent } from './simple-permissions/simple-permissions.component';
import { TagPermissionsComponent } from './tag-permissions/tag-permissions.component';

@NgModule({
    declarations: [PermissionsComponent, TagPermissionsComponent, NodePermissionsComponent, SimplePermissionsComponent],
    imports: [
        AccordionModule,
        CheckboxModule,
        CommonModule,
        SharedModule,
        PaginatorModule,
        TreeTableModule,
        ButtonModule
    ],
    providers: []
})
export class PermissionsModule {}
