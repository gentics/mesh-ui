import { MeshControl, ROOT_NAME, ROOT_TYPE } from './mesh-control.class';
import { MeshFieldComponent, SchemaFieldPath, UpdateFunction } from '../../common/form-generator-models';
import { SchemaField } from '../../../../common/models/schema.model';
import { NodeFieldType } from '../../../../common/models/node.model';
import createSpy = jasmine.createSpy;

describe('MeshControl class', () => {

    it('creates a root control when constructed with no arguments', () => {
        const meshControl = new MeshControl();
        expect(meshControl.fieldDef.name).toBe(ROOT_NAME);
        expect(meshControl.fieldDef.type).toBe(ROOT_TYPE);
    });

    it('constructor with fieldDef and initialValue', () => {
        const fieldDef: SchemaField = {
            name: 'test',
            type: 'string'
        };
        const meshControl = new MeshControl(fieldDef, 'foo');
        expect(meshControl.fieldDef).toBe(fieldDef);
    });

    it('constructor with fieldDef, initialValue and meshFieldInstance', () => {
        const fieldDef: SchemaField = {
            name: 'test',
            type: 'string'
        };
        const meshField = new MockMeshField();
        const meshControl = new MeshControl(fieldDef, 'foo', meshField);
        expect(meshControl.fieldDef).toBe(fieldDef);
        expect(meshControl.meshField).toBe(meshField);
    });

    it('registerMeshFieldInstance() sets the meshField', () => {
        const fieldDef: SchemaField = {
            name: 'test',
            type: 'string'
        };
        const meshControl = new MeshControl(fieldDef, 'foo');
        expect(meshControl.fieldDef).toBe(fieldDef);
        expect(meshControl.meshField).toBeUndefined();

        const meshField = new MockMeshField();
        meshControl.registerMeshFieldInstance(meshField);
        expect(meshControl.meshField).toBe(meshField);
    });

    it('addChild() adds a new meshControl to the children map', () => {
        const fieldDef: SchemaField = {
            name: 'test',
            type: 'list',
            listType: 'string'
        };
        const initialValue = ['foo'];
        const meshField = new MockMeshField();
        meshField.valueChange = createSpy('valueChange');
        const meshControl = new MeshControl(fieldDef, initialValue, meshField);

        expect(meshControl.children.size).toBe(0);

        const childField = new MockMeshField();
        const pseudoField: SchemaField = {
            name: 'child',
            type: 'string'
        };
        childField.valueChange = createSpy('valueChange');
        meshControl.addChild(pseudoField, 'childValue', childField);

        expect(meshControl.children.size).toBe(1);
        expect(meshControl.children.has(0)).toBe(true);
        const childMeshControl = meshControl.children.get(0) as MeshControl;
        expect(childMeshControl instanceof MeshControl).toBe(true);
        expect(childMeshControl.meshField).toBe(childField);
    });

    describe('checkValue() with primitives', () => {

        let meshField: MockMeshField;
        let meshControl: MeshControl;

        beforeEach(() => {
            const fieldDef: SchemaField = {
                name: 'test',
                type: 'string'
            };
            meshField = new MockMeshField();
            meshField.valueChange = createSpy('valueChange');
            meshControl = new MeshControl(fieldDef, 'foo', meshField);
        });

        it('invokes meshField.valueChange() when the value has changed', () => {
            meshControl.checkValue('bar');
            expect(meshField.valueChange).toHaveBeenCalledWith('bar');
        });

        it('does not invoke meshField.valueChange() when the value is identical', () => {
            meshControl.checkValue('foo');
            expect(meshField.valueChange).not.toHaveBeenCalled();
        });

        it('handles multiple calls with occasionally changing value', () => {
            meshControl.checkValue('foo');
            expect(meshField.valueChange).toHaveBeenCalledTimes(0);
            meshControl.checkValue('bar');
            expect(meshField.valueChange).toHaveBeenCalledTimes(1);
            meshControl.checkValue('bar');
            expect(meshField.valueChange).toHaveBeenCalledTimes(1);
            meshControl.checkValue('baz');
            expect(meshField.valueChange).toHaveBeenCalledTimes(2);
            meshControl.checkValue('baz');
            expect(meshField.valueChange).toHaveBeenCalledTimes(2);
            meshControl.checkValue('baz');
            expect(meshField.valueChange).toHaveBeenCalledTimes(2);
            meshControl.checkValue('foo');
            expect(meshField.valueChange).toHaveBeenCalledTimes(3);
        });

    });

    describe('checkValue() with objects', () => {

        let meshField: MockMeshField;
        let meshControl: MeshControl;
        let initialValue: string[];

        beforeEach(() => {
            const fieldDef: SchemaField = {
                name: 'test',
                type: 'list',
                listType: 'string'
            };
            initialValue = ['foo', 'bar', 'baz'];
            meshField = new MockMeshField();
            meshField.valueChange = createSpy('valueChange');
            meshControl = new MeshControl(fieldDef, initialValue, meshField);
        });

        it('invokes meshField.valueChange() when the object reference changes', () => {
            let newValue = initialValue.slice(0);
            meshControl.checkValue(newValue);
            expect(meshField.valueChange).toHaveBeenCalledWith(newValue);
        });

        it('does not invoke meshField.valueChange() when the object is mutated', () => {
            const newValue = initialValue;
            newValue.push('quux');
            meshControl.checkValue(newValue);
            expect(meshField.valueChange).not.toHaveBeenCalled();
        });

    });

    describe('list type', () => {

        let meshField: MockMeshField;
        let meshControl: MeshControl;
        let childMeshFields: MeshFieldComponent[];
        let childMeshControls: MeshControl[];
        let initialValue: string[];

        beforeEach(() => {
            childMeshFields = [];
            childMeshControls = [];
            const fieldDef: SchemaField = {
                name: 'test',
                type: 'list',
                listType: 'string'
            };
            initialValue = ['foo', 'bar', 'baz'];
            meshField = new MockMeshField();
            meshField.valueChange = createSpy('valueChange');
            meshControl = new MeshControl(fieldDef, initialValue, meshField);

            initialValue.forEach((value, index) => {
                const childField = new MockMeshField();
                const pseudoField = {
                    name: `${fieldDef.name} ${index}`,
                    type: fieldDef.listType as 'string'
                };
                childField.valueChange = createSpy('valueChange');
                childMeshFields.push(childField);

                const childControl = meshControl.addChild(pseudoField, value, childField);
                childMeshControls.push(childControl);
            });
        });

        it('addChild() creates new MeshControls with numeric indices', () => {
            expect(meshControl.children.size).toBe(3);
            expect(meshControl.children.has(0)).toBe(true);
            expect(meshControl.children.has(1)).toBe(true);
            expect(meshControl.children.has(2)).toBe(true);
            expect(meshControl.children.has(3)).toBe(false);
        });

        it('clearChildren() empties the children map', () => {
            expect(meshControl.children.size).toBe(3);
            meshControl.clearChildren();
            expect(meshControl.children.size).toBe(0);
        });

        it('checkValue() on parent invokes checkValue() on children', () => {
            const spies = childMeshControls.map(control => spyOn(control, 'checkValue').and.callThrough());
            meshControl.checkValue(['quux', 'duux', 'muux']);

            expect(spies[0]).toHaveBeenCalledWith('quux');
            expect(spies[1]).toHaveBeenCalledWith('duux');
            expect(spies[2]).toHaveBeenCalledWith('muux');
        });

    });

    describe('simple micronode type', () => {

        let meshField: MockMeshField;
        let meshControl: MeshControl;
        let childMeshFields: MeshFieldComponent[];
        let childMeshControls: MeshControl[];
        let initialValue: any;

        beforeEach(() => {
            childMeshFields = [];
            childMeshControls = [];
            const fieldDef: SchemaField = {
                name: 'test',
                type: 'micronode',
            };
            initialValue = {
                uuid: '123123123',
                microschema: {
                    name: 'test',
                    uuid: '999'
                },
                fields: {
                    name: 'joe',
                    age: 21
                }
            };
            meshField = new MockMeshField();
            meshField.valueChange = createSpy('valueChange');
            meshControl = new MeshControl(fieldDef, initialValue, meshField);

            function addChild(name: string, type: 'string' | 'number', value: any) {
                const childField = new MockMeshField();
                const pseudoField = { name, type };
                childField.valueChange = createSpy('valueChange');
                childMeshFields.push(childField);

                const childControl = meshControl.addChild(pseudoField, value, childField);
                childMeshControls.push(childControl);
            }

            addChild('name', 'string', 'joe');
            addChild('age', 'number', 21);
        });

        it('addChild() creates new MeshControls with string indices', () => {
            expect(meshControl.children.size).toBe(2);
            expect(meshControl.children.has('name')).toBe(true);
            expect(meshControl.children.has('age')).toBe(true);
            expect(meshControl.children.has(0)).toBe(false);
        });

        it('clearChildren() empties the children map', () => {
            expect(meshControl.children.size).toBe(2);
            meshControl.clearChildren();
            expect(meshControl.children.size).toBe(0);
        });

        it('checkValue() on parent invokes checkValue() on children', () => {
            const spies = childMeshControls.map(control => spyOn(control, 'checkValue').and.callThrough());
            initialValue.fields.name = 'pete';
            initialValue.fields.age = 42;
            meshControl.checkValue(initialValue);

            expect(spies[0]).toHaveBeenCalledWith('pete');
            expect(spies[1]).toHaveBeenCalledWith(42);
        });
    });

    describe('getMeshControlAtPath()', () => {

        let meshField: MockMeshField;
        let rootControl: MeshControl;
        let childControls: { [id: string]: MeshControl };

        beforeEach(() => {
            childControls = {};
            const fieldDef: SchemaField = {
                name: 'addresses',
                type: 'list',
                listType: 'micronode'
            };
            meshField = new MockMeshField();
            rootControl = new MeshControl(fieldDef, {}, meshField);

            function addChild(parent: MeshControl, name: string, type: any, value: any): MeshControl {
                const childField = new MockMeshField();
                const pseudoField = { name, type };
                const childControl = parent.addChild(pseudoField, value, childField);
                return childControl;
            }
            childControls['0']              = addChild(rootControl, '0', 'micronode', {});
            childControls['1']              = addChild(rootControl, '1', 'micronode', {});

            childControls['0.latitude']     = addChild(childControls['0'], 'latitude', 'number', 0);
            childControls['0.longitude']    = addChild(childControls['0'], 'longitude', 'number', 0);
            childControls['0.names']        = addChild(childControls['0'], 'names', 'list', []);
            childControls['0.names.0']      = addChild(childControls['0.names'], '0', 'string', 'name1');
            childControls['0.names.1']      = addChild(childControls['0.names'], '1', 'string', 'name2');

            childControls['1.latitude']     = addChild(childControls['1'], 'latitude', 'number', 0);
            childControls['1.longitude']    = addChild(childControls['1'], 'longitude', 'number', 0);
            childControls['1.names']        = addChild(childControls['1'], 'names', 'list', []);
            childControls['1.names.0']      = addChild(childControls['1.names'], '0', 'string', 'name1');
            childControls['1.names.1']      = addChild(childControls['1.names'], '1', 'string', 'name2');
        });

        it('gets top level control', () => {
            expect(rootControl.getMeshControlAtPath([])).toBe(rootControl);
        });

        it('gets first list item', () => {
            expect(rootControl.getMeshControlAtPath([0])).toBe(childControls['0']);
        });

        it('gets second list item', () => {
            expect(rootControl.getMeshControlAtPath([1])).toBe(childControls['1']);
        });

        it('gets child of first list item', () => {
            expect(rootControl.getMeshControlAtPath([0, 'fields', 'latitude']))
                .toBe(childControls['0.latitude']);
        });

        it('gets first item of child list of first list item', () => {
            expect(rootControl.getMeshControlAtPath([0, 'fields', 'names', 0]))
                .toBe(childControls['0.names.0']);
        });

        it('gets second item of child list of first list item', () => {
            expect(rootControl.getMeshControlAtPath([0, 'fields', 'names', 1]))
                .toBe(childControls['0.names.1']);
        });
    });

    describe('validation', () => {

        it('isValid == true when there are no own validation errors', () => {
            const fieldDef: SchemaField = {
                name: 'test',
                type: 'string',
                required: true
            };
            const meshControl = new MeshControl(fieldDef, 'foo');
            expect(meshControl.isValid).toBe(true);
        });

        it('isValid == false when there is own validation error', () => {
            const fieldDef: SchemaField = {
                name: 'test',
                type: 'string',
                required: true
            };
            const meshControl = new MeshControl(fieldDef, '');
            expect(meshControl.isValid).toBe(false);
        });

        it('isValid == true when there are no own or child validation errors', () => {
            const fieldDef: SchemaField = {
                name: 'test',
                type: 'micronode'
            };
            const initialValue = { child: '' };
            const meshControl = new MeshControl(fieldDef, initialValue);

            expect(meshControl.children.size).toBe(0);

            const pseudoField: SchemaField = {
                name: 'child',
                type: 'string',
                required: true
            };
            meshControl.addChild(pseudoField, 'childValue');

            expect(meshControl.isValid).toBe(true);
        });

        it('isValid == false when there is a child validation error', () => {
            const fieldDef: SchemaField = {
                name: 'test',
                type: 'micronode'
            };
            const initialValue = { child: '' };
            const meshControl = new MeshControl(fieldDef, initialValue);

            expect(meshControl.children.size).toBe(0);

            const pseudoField1: SchemaField = {
                name: 'child1',
                type: 'string',
                required: true
            };
            meshControl.addChild(pseudoField1, '');
            const pseudoField2: SchemaField = {
                name: 'child2',
                type: 'string',
                required: true
            };
            meshControl.addChild(pseudoField2, 'okay');

            expect(meshControl.isValid).toBe(false);
        });

        it('isValid == false when there is a child validation error 2 levels deep', () => {
            const fieldDef: SchemaField = {
                name: 'test',
                type: 'micronode'
            };
            const initialValue = { child: '' };
            const meshControl = new MeshControl(fieldDef, initialValue);

            expect(meshControl.children.size).toBe(0);

            const listField: SchemaField = {
                name: 'child1',
                type: 'list',
                listType: 'string'
            };
            const listControl = meshControl.addChild(listField, '');

            const stringField: SchemaField = {
                name: 'child2',
                type: 'string',
                required: true
            };
            listControl.addChild(stringField, 'okay');

            expect(meshControl.isValid).toBe(true);
            listControl.checkValue('');
            expect(meshControl.isValid).toBe(false);
        });
    });

});

/* tslint:disable */
class MockMeshField implements MeshFieldComponent {
    initialize(path: SchemaFieldPath, field: SchemaField, value: NodeFieldType, update: UpdateFunction): void {}
    valueChange(value: NodeFieldType): void {}
}
/* tslint:enable */
