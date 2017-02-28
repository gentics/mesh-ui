import { TestBed } from '@angular/core/testing';
import { MeshControlGroup } from './mesh-control-group.service';
import { MeshControl, ROOT_TYPE } from './mesh-control.class';
import createSpy = jasmine.createSpy;

describe('MeshControlGroup', () => {

    let meshControlGroup: MeshControlGroup;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MeshControlGroup]
        });

        meshControlGroup = TestBed.get(MeshControlGroup);
    });

    it('init() sets the _rootControl to a root MeshControl', () => {
        expect(meshControlGroup._rootControl).toBeUndefined();

        meshControlGroup.init();

        expect(meshControlGroup._rootControl).toBeDefined();
        expect(meshControlGroup._rootControl.fieldDef.type).toBe(ROOT_TYPE);
    });

    it('addControl() adds a control with named key to the _rootControl', () => {
        meshControlGroup.init();

        expect(meshControlGroup._rootControl.children.size).toBe(0);

        const mockMeshField: any = {};
        const mockFieldDef: any = {
            name: 'test',
            type: 'string'
        };
        meshControlGroup.addControl(mockFieldDef, 'foo', mockMeshField);

        expect(meshControlGroup._rootControl.children.size).toBe(1);
        const meshControl = meshControlGroup._rootControl.children.get('test') as MeshControl;
        expect(meshControl.meshField).toBe(mockMeshField);
    });

    describe('checkValue()', () => {

        let test1Control: MeshControl;
        let test2Control: MeshControl;

        beforeEach(() => {
            meshControlGroup.init();

            expect(meshControlGroup._rootControl.children.size).toBe(0);

            const mockMeshField: any = {};
            meshControlGroup.addControl({ name: 'test1', type: 'string' }, 'foo', mockMeshField);
            meshControlGroup.addControl({ name: 'test2', type: 'string' }, 'bar', mockMeshField);

            function getChildControl(name: string): MeshControl {
                return meshControlGroup._rootControl.children.get(name) as MeshControl;
            }

            test1Control = getChildControl('test1');
            test2Control = getChildControl('test2');
            test1Control.checkValue = createSpy('checkValue');
            test2Control.checkValue = createSpy('checkValue');
        });

        it('invokes checkValue() for each child matching a key of values', () => {
            meshControlGroup.checkValue({ test1: 'quux' });

            expect(test1Control.checkValue).toHaveBeenCalledTimes(1);
            expect(test2Control.checkValue).toHaveBeenCalledTimes(0);

            meshControlGroup.checkValue({ test1: 'muux', test2: 'quux' });

            expect(test1Control.checkValue).toHaveBeenCalledTimes(2);
            expect(test2Control.checkValue).toHaveBeenCalledTimes(1);
        });

        it('ignores non-matching keys', () => {
            meshControlGroup.checkValue({ nonMatching: 'quux', test5: 'bar' });
            meshControlGroup.checkValue({ bad: 12 });

            expect(test1Control.checkValue).toHaveBeenCalledTimes(0);
            expect(test2Control.checkValue).toHaveBeenCalledTimes(0);
        });

    });

    it('getMeshControlAtPath() invokes _rootControl.getMeshControlAtPath()', () => {
        meshControlGroup.init();
        const spy = spyOn(meshControlGroup._rootControl, 'getMeshControlAtPath');
        const path = ['foo'];
        meshControlGroup.getMeshControlAtPath(path);

        expect(spy).toHaveBeenCalledWith(path);
    });

});
