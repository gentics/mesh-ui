import { MeshControl, ROOT_NAME, ROOT_TYPE } from './mesh-control.class';
import { MeshFieldControlApi } from '../../common/form-generator-models';
import { SchemaField } from '../../../../common/models/schema.model';
import { NodeFieldMicronode, NodeFieldType } from '../../../../common/models/node.model';
import { BaseFieldComponent } from '../../components/base-field/base-field.component';
import { MeshControlGroupService } from './mesh-control-group.service';
import createSpy = jasmine.createSpy;

describe('MeshControl class', () => {

    const mockControlGroup = new MeshControlGroupService();

    it('creates a root control when constructed with no arguments', () => {
        const meshControl = new MeshControl<any>();
        expect(meshControl.fieldDef.name).toBe(ROOT_NAME);
        expect(meshControl.fieldDef.type).toBe(ROOT_TYPE);
    });

    it('constructor with fieldDef and initialValue', () => {
        const fieldDef: SchemaField = {
            name: 'test',
            type: 'string'
        };
        const meshControl = new MeshControl<any>(fieldDef, 'foo');
        expect(meshControl.fieldDef).toBe(fieldDef);
    });

    it('constructor with fieldDef, initialValue, group and meshFieldInstance', () => {
        const fieldDef: SchemaField = {
            name: 'test',
            type: 'string'
        };
        const meshField = new MockMeshField();
        const meshControl = new MeshControl<any>(fieldDef, 'foo', mockControlGroup, meshField);
        expect(meshControl.fieldDef).toBe(fieldDef);
        expect(meshControl.group).toBe(mockControlGroup);
        expect(meshControl.meshField).toBe(meshField);
    });

    it('registerMeshFieldInstance() sets the meshField', () => {
        const fieldDef: SchemaField = {
            name: 'test',
            type: 'string'
        };
        const meshControl = new MeshControl<any>(fieldDef, 'foo');
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
        const meshControl = new MeshControl<any>(fieldDef, initialValue, mockControlGroup, meshField);

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
        const childMeshControl = meshControl.children.get(0) as MeshControl<any>;
        expect(childMeshControl instanceof MeshControl).toBe(true);
        expect(childMeshControl.meshField).toBe(childField);
    });

    describe('checkValue() with primitives', () => {

        let meshField: MockMeshField;
        let meshControl: MeshControl<any>;

        beforeEach(() => {
            const fieldDef: SchemaField = {
                name: 'test',
                type: 'string'
            };
            meshField = new MockMeshField();
            meshField.valueChange = createSpy('valueChange');
            meshControl = new MeshControl<any>(fieldDef, 'foo', mockControlGroup, meshField);
        });

        it('invokes meshField.valueChange() when the value has changed with the new value and old value', () => {
            meshControl.checkValue('bar');
            expect(meshField.valueChange).toHaveBeenCalledWith('bar', 'foo');
        });

        it('invokes meshField.valueChange() when the value is identical', () => {
            meshControl.checkValue('foo');
            expect(meshField.valueChange).toHaveBeenCalledWith('foo', 'foo');
        });
    });

    describe('checkValue() with objects', () => {

        let meshField: MockMeshField;
        let meshControl: MeshControl<any>;
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
            meshControl = new MeshControl<any>(fieldDef, initialValue, mockControlGroup, meshField);
        });

        it('invokes meshField.valueChange() when the object reference changes', () => {
            const newValue = initialValue.slice(0);
            meshControl.checkValue(newValue);
            expect(meshField.valueChange).toHaveBeenCalledWith(newValue, initialValue);
        });

        it('invokes meshField.valueChange() when the object is mutated', () => {
            const newValue = initialValue;
            newValue.push('quux');
            meshControl.checkValue(newValue);
            expect(meshField.valueChange).toHaveBeenCalledWith(newValue, initialValue);
        });

    });

    describe('nodeChange()', () => {

        let meshField: MockMeshField;
        let meshControl: MeshControl<any>;

        beforeEach(() => {
            const fieldDef: SchemaField = {
                name: 'test',
                type: 'string'
            };
            meshField = new MockMeshField();
            meshField.nodeFieldChange = createSpy('nodeFieldChange');
            meshControl = new MeshControl<any>(fieldDef, 'foo', mockControlGroup, meshField);
        });

        it('invokes meshField.nodeFieldChange()', () => {
            const path = ['foo'];
            const value = 'bar';
            const node = {} as any;
            meshControl.nodeChanged(path, value, node);
            expect(meshField.nodeFieldChange).toHaveBeenCalledWith(path, value, node);
        });
    });

    describe('formWidthChanged()', () => {
        let meshFieldParent: MockMeshField;
        let meshFieldChild: MockMeshField;
        let meshControl: MeshControl<any>;
        let initialValue: string[];

        beforeEach(() => {
            const fieldDefList: SchemaField = {
                name: 'parent',
                type: 'list',
                listType: 'string'
            };
            const fieldDefString: SchemaField = {
                name: 'chil',
                type: 'string',
            };
            initialValue = ['foo', 'bar', 'baz'];
            meshFieldParent = new MockMeshField();
            meshFieldParent.formWidthChange = createSpy('formWidthChange');
            meshControl = new MeshControl<any>(fieldDefList, initialValue, mockControlGroup, meshFieldParent);
            meshFieldChild = new MockMeshField();
            meshFieldChild.formWidthChange = createSpy('formWidthChange');
            meshControl.addChild(fieldDefString, 'foo', meshFieldChild);
        });

        it('invokes meshField.formWidthChange()', () => {
            meshControl.formWidthChanged(123);
            expect(meshFieldParent.formWidthChange).toHaveBeenCalledWith(123);
        });

        it('invokes meshField.formWidthChange() on children', () => {
            meshControl.formWidthChanged(345);
            expect(meshFieldChild.formWidthChange).toHaveBeenCalledWith(345);
        });
    });

    describe('list type', () => {

        let meshField: MockMeshField;
        let meshControl: MeshControl<any>;
        let childMeshFields: BaseFieldComponent[];
        let childMeshControls: Array<MeshControl<any>>;
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
            meshControl = new MeshControl<any>(fieldDef, initialValue, mockControlGroup, meshField);

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

        it('child control has access to MeshControlGroup', () => {
            expect((meshControl.children.get(0) as MeshControl<any>).group).toBe(mockControlGroup);
            expect((meshControl.children.get(1) as MeshControl<any>).group).toBe(mockControlGroup);
            expect((meshControl.children.get(2) as MeshControl<any>).group).toBe(mockControlGroup);
        });

        it('clearChildren() empties the children map', () => {
            expect(meshControl.children.size).toBe(3);
            meshControl.clearChildren();
            expect(meshControl.children.size).toBe(0);
        });

        it('checkValue() on parent invokes checkValue() on children when recursive == true', () => {
            const spies = childMeshControls.map(control => spyOn(control, 'checkValue').and.callThrough());
            meshControl.checkValue(['quux', 'duux', 'muux'], true);

            expect(spies[0]).toHaveBeenCalledWith('quux', true);
            expect(spies[1]).toHaveBeenCalledWith('duux', true);
            expect(spies[2]).toHaveBeenCalledWith('muux', true);
        });

        it('checkValue() on parent does not invoke checkValue() on children when recursive == false', () => {
            const spies = childMeshControls.map(control => spyOn(control, 'checkValue').and.callThrough());
            meshControl.checkValue(['quux', 'duux', 'muux'], false);

            expect(spies[0]).not.toHaveBeenCalled();
            expect(spies[1]).not.toHaveBeenCalled();
            expect(spies[2]).not.toHaveBeenCalled();
        });

        it('nodeChanged() on parent invokes meshField.nodeChanged() on children', () => {
            const spies = childMeshControls.map(control => spyOn(control, 'nodeChanged').and.callThrough());
            const path = ['foo'];
            const value = 'bar';
            const node = {} as any;
            meshControl.nodeChanged(path, value, node);
            expect(spies[0]).toHaveBeenCalledWith(path, value, node);
            expect(spies[1]).toHaveBeenCalledWith(path, value, node);
            expect(spies[2]).toHaveBeenCalledWith(path, value, node);
        });

    });

    describe('simple micronode type', () => {

        let meshField: MockMeshField;
        let meshControl: MeshControl<any>;
        let childMeshFields: BaseFieldComponent[];
        let childMeshControls: Array<MeshControl<any>>;
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
            meshControl = new MeshControl<any>(fieldDef, initialValue, mockControlGroup, meshField);

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

        it('child control has access to MeshControlGroup', () => {
            expect((meshControl.children.get('name') as MeshControl<any>).group).toBe(mockControlGroup);
            expect((meshControl.children.get('age') as MeshControl<any>).group).toBe(mockControlGroup);
        });

        it('clearChildren() empties the children map', () => {
            expect(meshControl.children.size).toBe(2);
            meshControl.clearChildren();
            expect(meshControl.children.size).toBe(0);
        });

        it('checkValue() on parent invokes checkValue() on children when recursive == true', () => {
            const spies = childMeshControls.map(control => spyOn(control, 'checkValue').and.callThrough());
            initialValue.fields.name = 'pete';
            initialValue.fields.age = 42;
            meshControl.checkValue(initialValue, true);

            expect(spies[0]).toHaveBeenCalledWith('pete', true);
            expect(spies[1]).toHaveBeenCalledWith(42, true);
        });

        it('checkValue() on parent does not invoke checkValue() on children when recursive == false', () => {
            const spies = childMeshControls.map(control => spyOn(control, 'checkValue').and.callThrough());
            initialValue.fields.name = 'pete';
            initialValue.fields.age = 42;
            meshControl.checkValue(initialValue, false);

            expect(spies[0]).not.toHaveBeenCalled();
            expect(spies[1]).not.toHaveBeenCalled();
        });

        it('nodeChanged() on parent invokes meshField.nodeChanged() on children', () => {
            const spies = childMeshControls.map(control => spyOn(control, 'nodeChanged').and.callThrough());
            const path = ['foo'];
            const value = 'bar';
            const node = {} as any;
            meshControl.nodeChanged(path, value, node);
            expect(spies[0]).toHaveBeenCalledWith(path, value, node);
            expect(spies[1]).toHaveBeenCalledWith(path, value, node);
        });
    });

    describe('getMeshControlAtPath()', () => {

        let meshField: MockMeshField;
        let rootControl: MeshControl<any>;
        let childControls: { [id: string]: MeshControl<any> };

        beforeEach(() => {
            childControls = {};
            const fieldDef: SchemaField = {
                name: 'addresses',
                type: 'list',
                listType: 'micronode'
            };
            meshField = new MockMeshField();
            rootControl = new MeshControl<any>(fieldDef, {}, mockControlGroup, meshField);

            function addChild(parent: MeshControl<any>, name: string, type: any, value: any): MeshControl<any> {
                const childField = new MockMeshField();
                const pseudoField = { name, type };
                const childControl = parent.addChild(pseudoField, value, childField);
                return childControl;
            }
            childControls['0']              = addChild(rootControl, '0', 'micronode', {});
            childControls['1']              = addChild(rootControl, '1', 'micronode', {});
            childControls['2']              = addChild(rootControl, '2', 'micronode', {});

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

        it('returns undefined for a top-level path which has no control', () => {
            expect(rootControl.getMeshControlAtPath(['nonexitent']))
                .toBe(undefined);
        });

        it('returns undefined for a micronode field which has no control', () => {
            expect(rootControl.getMeshControlAtPath([0, 'fields', 'nonexistent']))
                .toBe(undefined);
        });

        it('returns undefined for a leaf of a path which has no control', () => {
            expect(rootControl.getMeshControlAtPath([0, 'fields', 'names', 1, 'nonexistent']))
                .toBe(undefined);
        });

        it('returns undefined for a "fields" path of a micronode with no children', () => {
            expect(rootControl.getMeshControlAtPath([2, 'fields']))
                .toBe(undefined);
        });

    });

    describe('validation', () => {

        it('isValid == false when no BaseMeshField has been registered', () => {
            const fieldDef: SchemaField = {
                name: 'test',
                type: 'string'
            };
            const meshControl = new MeshControl<any>(fieldDef, 'foo');
            expect(meshControl.isValid).toBe(false);
        });

        it('isValid == true when there are no own validation errors', () => {
            const fieldDef: SchemaField = {
                name: 'test',
                type: 'string'
            };
            const meshControl = new MeshControl<any>(fieldDef, 'foo', mockControlGroup, new MockMeshField());
            expect(meshControl.isValid).toBe(true);
        });

        it('isValid == false when there is own validation error', () => {
            const fieldDef: SchemaField = {
                name: 'test',
                type: 'string'
            };
            const mockMeshField = new MockMeshField();
            mockMeshField.setError({ err: 'error' });
            const meshControl = new MeshControl<any>(fieldDef, '', mockControlGroup, mockMeshField);
            expect(meshControl.isValid).toBe(false);
        });

        it('isValid == true when there are no own or child validation errors', () => {
            const fieldDef: SchemaField = {
                name: 'test',
                type: 'micronode'
            };
            const initialValue = { child: '' };
            const meshControl = new MeshControl<any>(fieldDef, initialValue, mockControlGroup, new MockMeshField());

            expect(meshControl.children.size).toBe(0);

            const pseudoField: SchemaField = {
                name: 'child',
                type: 'string'
            };
            meshControl.addChild(pseudoField, 'childValue', new MockMeshField());

            expect(meshControl.isValid).toBe(true);
        });

        it('isValid == false when there is a child validation error', () => {
            const fieldDef: SchemaField = {
                name: 'test',
                type: 'micronode'
            };
            const initialValue = { child: '' };
            const meshControl = new MeshControl<any>(fieldDef, initialValue);

            expect(meshControl.children.size).toBe(0);

            const pseudoField1: SchemaField = {
                name: 'child1',
                type: 'string'
            };
            const mockChildField = new MockMeshField();
            mockChildField.setError({ err: 'error' });
            meshControl.addChild(pseudoField1, '', mockChildField);
            const pseudoField2: SchemaField = {
                name: 'child2',
                type: 'string'
            };
            meshControl.addChild(pseudoField2, 'okay', new MockMeshField());

            expect(meshControl.isValid).toBe(false);
        });

        it('isValid == false when there is a child validation error 2 levels deep', () => {
            const fieldDef: SchemaField = {
                name: 'test',
                type: 'micronode'
            };
            const initialValue = { child: '' };
            const meshControl = new MeshControl<any>(fieldDef, initialValue, mockControlGroup, new MockMeshField());

            expect(meshControl.children.size).toBe(0);

            const listField: SchemaField = {
                name: 'child1',
                type: 'list',
                listType: 'string'
            };
            const listControl = meshControl.addChild(listField, [], new MockMeshField());

            const mockChildField = new MockMeshField();
            const stringField: SchemaField = {
                name: 'child2',
                type: 'string'
            };
            listControl.addChild(stringField, 'okay', mockChildField);

            expect(meshControl.isValid).toBe(true);
            mockChildField.setError({ err: 'error' });
            expect(meshControl.isValid).toBe(false);
        });
    });

    describe('errors', () => {

        it('errors object is empty when there are no own validation errors', () => {
            const fieldDef: SchemaField = {
                name: 'test',
                type: 'string'
            };
            const meshControl = new MeshControl<any>(fieldDef, 'foo', mockControlGroup, new MockMeshField());
            expect(meshControl.errors).toEqual({});
        });

        it('isValid == false when there is own validation error', () => {
            const fieldDef: SchemaField = {
                name: 'test',
                type: 'string'
            };
            const mockMeshField = new MockMeshField();
            mockMeshField.setError({ err: 'error' });
            const meshControl = new MeshControl<any>(fieldDef, '', mockControlGroup, mockMeshField);
            expect(meshControl.errors).toEqual({ err: 'error' });
        });
    });

    describe('getChanges()', () => {

        describe('simple value', () => {
            let meshControl: MeshControl<string>;
            const initialValue = 'foo';

            beforeEach(() => {
                const fieldDef: SchemaField = {
                    name: 'test',
                    type: 'string'
                };
                meshControl = new MeshControl(fieldDef, initialValue, mockControlGroup, new MockMeshField());
            });

            it('"changed" starts false and stays false while value is unchanged', () => {
                expect(meshControl.getChanges().changed).toBe(false);

                meshControl.checkValue(initialValue);
                expect(meshControl.getChanges().changed).toBe(false);
            });

            it('"changed" property set to true after checkValue() called with different value', () => {
                expect(meshControl.getChanges().changed).toBe(false);

                meshControl.checkValue('bar');
                expect(meshControl.getChanges().changed).toBe(true);
            });

            it('"initialValue" and "currentValue" properties update correctly', () => {
                meshControl.checkValue('bar');
                const changes = meshControl.getChanges();
                expect(changes.initialValue).toBe(initialValue);
                expect(changes.currentValue).toBe('bar');
            });
        });

        describe('object values', () => {

            it('compares lists by value equality, not by reference', () => {
                const fieldDef: SchemaField = {
                    name: 'test',
                    type: 'list',
                    listType: 'string'
                };
                const meshControl = new MeshControl(fieldDef, ['foo', 'bar'], mockControlGroup, new MockMeshField());
                expect(meshControl.getChanges().changed).toBe(false);

                meshControl.checkValue(['foo', 'bar']);
                expect(meshControl.getChanges().changed).toBe(false);
            });

            it('compares micronodes by value equality, not by reference', () => {
                const fieldDef: SchemaField = {
                    name: 'test',
                    type: 'micronode',
                };

                function getMicronodeValue(fields: { [key: string]: any }): NodeFieldMicronode {
                    return {
                        uuid: 'test',
                        microschema: {} as any,
                        fields
                    };
                }
                const meshControl = new MeshControl(fieldDef, getMicronodeValue({ test: 'foo' }), mockControlGroup, new MockMeshField());
                expect(meshControl.getChanges().changed).toBe(false);

                meshControl.checkValue(getMicronodeValue({ test: 'foo' }));
                expect(meshControl.getChanges().changed).toBe(false);
            });

        });

        describe('with children', () => {

            let meshControl: MeshControl<string[]>;
            let initialValue: string[];

            beforeEach(() => {
                const fieldDef: SchemaField = {
                    name: 'test',
                    type: 'list',
                    listType: 'string'
                };
                initialValue = ['foo', 'bar', 'baz'];
                meshControl = new MeshControl(fieldDef, initialValue, mockControlGroup, new MockMeshField());

                initialValue.forEach((value, index) => {
                    const childField = new MockMeshField();
                    const pseudoField = {
                        name: `${fieldDef.name} ${index}`,
                        type: fieldDef.listType as 'string'
                    };
                    meshControl.addChild(pseudoField, value, childField);
                });
            });

            it('returns a nested ControlChanges object', () => {
                expect(meshControl.getChanges()).toEqual({
                    changed: false,
                    initialValue,
                    currentValue: initialValue,
                    children: {
                        0: {
                            changed: false,
                            initialValue: 'foo',
                            currentValue: 'foo',
                            children: {}
                        },
                        1: {
                            changed: false,
                            initialValue: 'bar',
                            currentValue: 'bar',
                            children: {}
                        },
                        2: {
                            changed: false,
                            initialValue: 'baz',
                            currentValue: 'baz',
                            children: {}
                        }
                    }
                });
            });

            it('registers a change on a child control', () => {
                initialValue[1] = 'quux';
                meshControl.checkValue(initialValue, true);
                const changes = meshControl.getChanges();

                expect(changes.changed).toBe(false);
                expect(changes.children[1].changed).toBe(true);
            });

            it('does not register a change on a parent control if the object reference changes but values are equal', () => {
                meshControl.checkValue(initialValue.slice(), true);
                const changes = meshControl.getChanges();

                expect(changes.changed).toBe(false);
                expect(changes.children[0].changed).toBe(false);
                expect(changes.children[1].changed).toBe(false);
                expect(changes.children[2].changed).toBe(false);
            });

            it('reset() resets changed state recursively', () => {
                meshControl.checkValue(['one', 'two', 'three'], true);
                const changes1 = meshControl.getChanges();

                expect(changes1.changed).toBe(true);
                expect(changes1.children[0].changed).toBe(true);
                expect(changes1.children[1].changed).toBe(true);
                expect(changes1.children[2].changed).toBe(true);

                meshControl.reset();
                const changes2 = meshControl.getChanges();

                expect(changes2.changed).toBe(false, 'parent');
                expect(changes2.children[0].changed).toBe(false, 'child0');
                expect(changes2.children[1].changed).toBe(false, 'child1');
                expect(changes2.children[2].changed).toBe(false, 'child2');
            });
        });

    });

});

class MockMeshField extends BaseFieldComponent {
    init(api: MeshFieldControlApi): void {}
    valueChange(value: NodeFieldType): void {}
}
