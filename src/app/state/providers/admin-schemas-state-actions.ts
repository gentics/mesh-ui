import { Injectable } from '@angular/core';
import { CloneDepth, Immutable, StateActionBranch } from 'immutablets';

import { Microschema } from '../../common/models/microschema.model';
import { Schema } from '../../common/models/schema.model';
import { MicroschemaResponse, ProjectResponse, SchemaResponse } from '../../common/models/server-models';
import { AdminSchemasState, ProjectAssignments } from '../models/admin-schemas-state.model';
import { AppState } from '../models/app-state.model';
import { EntityState } from '../models/entity-state.model';

import { mergeEntityState } from './entity-state-actions';

@Injectable()
@Immutable()
export class AdminSchemasStateActions extends StateActionBranch<AppState> {
    @CloneDepth(1)
    private adminSchemas: AdminSchemasState;
    @CloneDepth(0)
    private entities: EntityState;

    constructor() {
        super({
            uses: ['adminSchemas', 'entities'],
            initialState: {
                adminSchemas: {
                    loadCount: 0,
                    assignedToProject: {},
                    schemaList: [],
                    schemaDetail: null,
                    microschemaList: [],
                    microschemaDetail: null,
                    pagination: {
                        currentPage: 1,
                        itemsPerPage: 25,
                        totalItems: null
                    },
                    filterTerm: '',
                    filterTermMicroschema: ''
                }
            }
        });
    }

    setSchemaListPagination(currentPage: number, itemsPerPage: number): void {
        this.adminSchemas.pagination = {
            currentPage,
            itemsPerPage,
            totalItems: null
        };
    }

    setFilterTerm(term: string): void {
        this.adminSchemas.filterTerm = term;
    }

    setFilterTermMicroschema(term: string): void {
        this.adminSchemas.filterTermMicroschema = term;
    }

    fetchSchemasStart() {
        this.adminSchemas.loadCount++;
    }

    fetchSchemasSuccess(schemas: Schema[]) {
        this.adminSchemas.loadCount--;
        this.adminSchemas.schemaList = schemas.map(schema => schema.uuid);
        this.entities = mergeEntityState(this.entities, { schema: schemas });
    }

    fetchSchemasError() {
        this.adminSchemas.loadCount--;
    }

    fetchMicroschemasStart() {
        this.adminSchemas.loadCount++;
    }

    fetchMicroschemasSuccess(microschemas: MicroschemaResponse[]) {
        this.adminSchemas.loadCount--;
        this.adminSchemas.microschemaList = microschemas.map(schema => schema.uuid);
        this.entities = mergeEntityState(this.entities, {
            microschema: microschemas as Microschema[]
        });
    }

    fetchMicroschemasError() {
        this.adminSchemas.loadCount--;
    }

    deleteMicroschemaStart(): void {
        this.adminSchemas.loadCount++;
    }

    deleteMicroschemaSuccess(microschemaUuid: string) {
        this.adminSchemas.loadCount--;
        this.adminSchemas.microschemaList = this.adminSchemas.microschemaList.filter(uuid => uuid !== microschemaUuid);
    }

    deleteMicroschemaError(): void {
        this.adminSchemas.loadCount--;
    }

    deleteSchemaStart(): void {
        this.adminSchemas.loadCount++;
    }

    deleteSchemaSuccess(schemaUuid: string) {
        this.adminSchemas.loadCount--;
        this.adminSchemas.schemaList = this.adminSchemas.schemaList.filter(uuid => uuid !== schemaUuid);
    }

    deleteSchemaError(): void {
        this.adminSchemas.loadCount--;
    }

    updateMicroschemaStart(): void {
        this.adminSchemas.loadCount++;
    }

    updateMicroschemaSuccess(response: MicroschemaResponse) {
        this.adminSchemas.loadCount--;
        this.entities = mergeEntityState(this.entities, {
            microschema: [response as Microschema]
        });
    }

    updateMicroschemaError(): void {
        this.adminSchemas.loadCount--;
    }

    createMicroschemaStart(): void {
        this.adminSchemas.loadCount++;
    }

    createMicroschemaSuccess(response: MicroschemaResponse) {
        this.adminSchemas.loadCount--;
        this.entities = mergeEntityState(this.entities, {
            microschema: [response as Microschema]
        });
        this.adminSchemas.microschemaList = [...this.adminSchemas.microschemaList, response.uuid];
    }

    createMicroschemaError(): void {
        this.adminSchemas.loadCount--;
    }

    openMicroschemaStart() {
        this.adminSchemas.loadCount++;
        this.adminSchemas.schemaDetail = null;
    }

    openMicroschemaSuccess(microschema: MicroschemaResponse) {
        this.adminSchemas.loadCount--;
        this.adminSchemas.microschemaDetail = microschema.uuid;
        this.entities = mergeEntityState(this.entities, {
            microschema: [microschema as Microschema]
        });
    }

    openMicroschemaError() {
        this.adminSchemas.loadCount--;
    }

    newMicroschema() {
        this.adminSchemas.microschemaDetail = null;
    }

    updateSchemaStart(): void {
        this.adminSchemas.loadCount++;
    }

    updateSchemaSuccess(response: SchemaResponse) {
        this.adminSchemas.loadCount--;
        this.entities = mergeEntityState(this.entities, {
            schema: [response as Schema]
        });
    }

    updateSchemaError(): void {
        this.adminSchemas.loadCount--;
    }

    createSchemaStart(): void {
        this.adminSchemas.loadCount++;
    }

    createSchemaSuccess(response: SchemaResponse) {
        this.adminSchemas.loadCount--;
        this.entities = mergeEntityState(this.entities, {
            schema: [response as Schema]
        });
        this.adminSchemas.schemaList = [...this.adminSchemas.schemaList, response.uuid];
    }

    createSchemaError(): void {
        this.adminSchemas.loadCount--;
    }

    openSchemaStart() {
        this.adminSchemas.loadCount++;
        this.adminSchemas.schemaDetail = null;
    }

    openSchemaSuccess(schema: SchemaResponse) {
        this.adminSchemas.loadCount--;
        this.adminSchemas.schemaDetail = schema.uuid;
        this.entities = mergeEntityState(this.entities, {
            schema: [schema as Schema]
        });
    }

    openSchemaError() {
        this.adminSchemas.loadCount--;
    }

    newSchema() {
        this.adminSchemas.schemaDetail = null;
    }

    fetchEntityAssignmentsStart() {
        this.adminSchemas.loadCount++;
    }

    fetchEntityAssignmentProjectsSuccess(projects: ProjectResponse[]) {
        this.entities = mergeEntityState(this.entities, {
            project: projects
        });
    }

    fetchEntityAssignmentsSuccess(assignments: ProjectAssignments) {
        this.adminSchemas.loadCount--;
        this.adminSchemas.assignedToProject = assignments;
    }

    fetchEntityAssignmentsError() {
        this.adminSchemas.loadCount--;
    }

    assignEntityToProjectStart(): void {
        this.adminSchemas.loadCount++;
    }

    assignEntityToProjectSuccess(): void {
        this.adminSchemas.loadCount--;
    }

    assignEntityToProjectError(): void {
        this.adminSchemas.loadCount--;
    }

    removeEntityFromProjectStart(): void {
        this.adminSchemas.loadCount++;
    }

    removeEntityFromProjectSuccess(): void {
        this.adminSchemas.loadCount--;
    }

    removeEntityFromProjectError(): void {
        this.adminSchemas.loadCount--;
    }
}
