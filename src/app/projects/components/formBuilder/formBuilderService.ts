module meshAdminUi {

    /**
     * This service is responsible for creating the INodeFieldModel objects which are used by the
     * formBuilder and widgets to generate the form for editing a node.
     */
    export class FormBuilderService {

        constructor(private mu: MeshUtils) {

        }

        /**
         * A NodeFieldModel object contains all the necessary data to render a single field in
         * the form, including the means to update itself.
         */
        public createNodeFieldModels(nodeFields:INodeFields,
                                     schemaFields:ISchemaFieldDefinition[],
                                     canUpdate: boolean,
                                     onChange: Function,
                                     displayField: string = '',
                                     pathPrefix: any[] = []): INodeFieldModel[] {

            return schemaFields.map(schemaField => {
                return this.createNodeFieldModel(nodeFields, schemaField, canUpdate, onChange, displayField, pathPrefix);
            });
        }

        /**
         * Creates and returns a NodeFieldModel object, which is used to generate
         * a single field in the node editor form.
         */
        public createNodeFieldModel(nodeFields:INodeFields,
                                     schemaField:ISchemaFieldDefinition,
                                     canUpdate: boolean,
                                     onChange: Function,
                                     displayField: string = '',
                                     pathPrefix: any[] = []): INodeFieldModel {
            let model:INodeFieldModel = <INodeFieldModel>angular.copy(schemaField);
            let path = pathPrefix.slice(0);
            if (schemaField.name) {
                path.push(schemaField.name);
            }

            nodeFields = this.ensureNodeFieldsExist(nodeFields, pathPrefix, schemaField);

            model.id = this.mu.generateGuid();
            model.value = angular.copy(this.getValueAtPath(nodeFields, path));
            model.path = path;
            model.canUpdate = canUpdate;
            model.isDisplayField = schemaField.name === displayField;
            model.onChange = onChange;
            model.update = this.makeUpdateFunction(model.path, nodeFields, onChange);
            model.createChild = this.makeCreateChildFunction(nodeFields, canUpdate, onChange, displayField);
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
        private makeCreateChildFunction(nodeFields: INodeFields, canUpdate: boolean, onChange: Function, displayField: string) {
            return (childFields: INodeFields, childSchemaField: ISchemaFieldDefinition, path?: any[]) => {
                let fields = nodeFields;
                if (!fields[path[0]]) {
                    fields[path[0]] = childFields;
                }
                return this.createNodeFieldModel(fields, childSchemaField, canUpdate, onChange, displayField, path);
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
