module meshAdminUi {

    export interface INodeFieldModelConfig {
        nodeFields: INodeFields;
        schemaFields?: ISchemaFieldDefinition[];
        schemaField?: ISchemaFieldDefinition;
        canUpdate: boolean;
        onChange: Function;
        projectName: string;
        node: INode;
        displayField?: string;
        pathPrefix?: any[];
    }

    /**
     * This service is responsible for creating the INodeFieldModel objects which are used by the
     * formBuilder and controls to generate the form for editing a node.
     */
    export class FormBuilderService {

        constructor(private mu: MeshUtils) {

        }

        /**
         * A NodeFieldModel object contains all the necessary data to render a single field in
         * the form, including the means to update itself.
         */
        public createNodeFieldModels(config: INodeFieldModelConfig): INodeFieldModel[] {
            config.displayField = config.displayField || '';
            config.pathPrefix = config.pathPrefix || [];

            return config.schemaFields.map(schemaField => {
                let nodeConfig = config;
                nodeConfig.schemaField = schemaField;
                return this.createNodeFieldModel(nodeConfig);
            });
        }

        /**
         * Creates and returns a NodeFieldModel object, which is used to generate
         * a single field in the node editor form.
         */
        public createNodeFieldModel(config: INodeFieldModelConfig): INodeFieldModel {
            config.displayField = config.displayField || '';
            config.pathPrefix = config.pathPrefix || [];

            let model:INodeFieldModel = <INodeFieldModel>angular.copy(config.schemaField);
            let path = config.pathPrefix.slice(0);
            if (config.schemaField.name) {
                path.push(config.schemaField.name);
            }

            config.nodeFields = this.ensureNodeFieldsExist(config.nodeFields, config.pathPrefix, config.schemaField);

            model.id = this.mu.generateGuid();
            model.value = angular.copy(this.getValueAtPath(config.nodeFields, path));
            model.path = path;
            model.canUpdate = config.canUpdate;
            model.isDisplayField = config.schemaField.name === config.displayField;
            model.projectName = config.projectName;
            model.node = config.node;
            model.onChange = config.onChange;
            model.update = this.makeUpdateFunction(model.path, config.nodeFields, config.onChange);
            model.createChild = this.makeCreateChildFunction(config);
            return model;
        }

        /**
         * Check that each of the fields specified in the schemaFields array has a counterpart defined
         * in the nodeFields object. If not, create a null placeholder property.
         */
        private ensureNodeFieldsExist(nodeFields: INodeFields, path: any[], schemaField: ISchemaFieldDefinition): INodeFields {
            if (!schemaField.name) {
                return nodeFields;
            }
            let pointer = this.getPointerByPath(nodeFields, path);
            if (0 < path.length) {
                if (pointer[path[path.length - 1]][schemaField.name] === undefined) {
                    pointer[path[path.length - 1]][schemaField.name] = null;
                }
            } else {
                if (!pointer[schemaField.name]) {
                    pointer[schemaField.name] = null;
                }
            }
            return nodeFields;
        }

        /**
         * Given an object and a path e.g. ['foo', 'bar'], return the value of
         * object.foo.bar.
         */
        private getValueAtPath(object: any, path: any[]) {
            let pointer = this.getPointerByPath(object, path);
            return pointer[path[path.length - 1]];
        }

        /**
         * Returns a pre-configured function that will update the node field specified by a path array.
         * Note: currently the actual node fields get updated simply because we are keeping a reference to them
         * via the `nodeFields` object, which we mutate here in this function.
         *
         * TODO: consider a more explicit data-flow where we pass the new, updated fields object back and do not
         * rely on mutation. Note that the current design may be this way specifically to prevent thrashing
         * and focus issues when dealing with list types - new objects may cause the input to lost focus on
         * each change.
         */
        private makeUpdateFunction(path: any[], nodeFields: INodeFields, onChange: Function): (value:any) => any {
            return (value) => {
                onChange();
                this.updateAtPath(nodeFields, path, value);
            }
        }

        /**
         * Factory function which returns a function that is used to create a child nodeFieldModel, which inherits
         * from the current one.
         */
        private makeCreateChildFunction(config: INodeFieldModelConfig) {
            return (childFields: INodeFields, childSchemaField: ISchemaFieldDefinition, path?: any[]) => {
                let fields = config.nodeFields;
                if (!fields[path[0]]) {
                    fields[path[0]] = childFields;
                }
                let childConfig = angular.copy(config);
                childConfig.nodeFields = fields;
                childConfig.schemaField = childSchemaField;
                childConfig.pathPrefix = path;
                return this.createNodeFieldModel(childConfig);
            };
        }

        /**
         * Given an object, update the value specified by the `path` array with the given value.
         */
        private updateAtPath(object:any, path:any[], value:any): any {
            let pointer = this.getPointerByPath(object, path);
            return pointer[path[path.length - 1]] = value;
        }

        /**
         * Given an object and a path e.g. ['foo', 'bar'], return the a pointer to
         * the object.foo.bar property.
         */
        private getPointerByPath(object: any, path: any[]): any {
            let pointer = object;
            for (let i = 0; i < path.length - 1; i++) {
                let key = path[i];
                if (!pointer[key]) {
                    pointer[key] = {};
                }
                pointer = pointer[key];
            }
            return pointer;
        }

    }

    angular.module('meshAdminUi.projects.formBuilder')
        .service('formBuilderService', FormBuilderService);

}
