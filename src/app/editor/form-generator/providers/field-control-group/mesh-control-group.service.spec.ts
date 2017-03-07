import { TestBed } from '@angular/core/testing';
import { MeshControlGroup } from './mesh-control-group.service';
import { MeshControl } from './mesh-control.class';
import createSpy = jasmine.createSpy;

describe('MeshControlGroup', () => {

    let meshControlGroup: MeshControlGroup;
    const INIT_ERROR = 'No rootControl was set. Did you forget to call MeshControlGroup.init()?';

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MeshControlGroup]
        });

        meshControlGroup = TestBed.get(MeshControlGroup);
    });

    it('calling addControl() before init() throws an exception', () => {
        expect(() => meshControlGroup.addControl(1 as any, 2 as any, 3 as any)).toThrowError(INIT_ERROR);
    });

    it('calling checkValue() before init() throws an exception', () => {
        expect(() => meshControlGroup.checkValue({})).toThrowError(INIT_ERROR);
    });

    it('calling getMeshControlAtPath() before init() throws an exception', () => {
        expect(() => meshControlGroup.getMeshControlAtPath([])).toThrowError(INIT_ERROR);
    });

    it('accessing isValid before init() returns false', () => {
        expect(meshControlGroup.isValid).toBe(false);
    });

    it('addControl() adds a control with named key to the _rootControl', () => {
        meshControlGroup.init();

        expect(meshControlGroup.getMeshControlAtPath([]).children.size).toBe(0);

        const mockMeshField: any = {};
        const mockFieldDef: any = {
            name: 'test',
            type: 'string'
        };
        meshControlGroup.addControl(mockFieldDef, 'foo', mockMeshField);

        expect(meshControlGroup.getMeshControlAtPath([]).children.size).toBe(1);
        const meshControl = meshControlGroup.getMeshControlAtPath([]).children.get('test') as MeshControl;
        expect(meshControl.meshField).toBe(mockMeshField);
    });

    describe('checkValue()', () => {

        let test1Control: MeshControl;
        let test2Control: MeshControl;

        beforeEach(() => {
            meshControlGroup.init();

            expect(meshControlGroup.getMeshControlAtPath([]).children.size).toBe(0);

            const mockMeshField: any = {};
            meshControlGroup.addControl({ name: 'test1', type: 'string' }, 'foo', mockMeshField);
            meshControlGroup.addControl({ name: 'test2', type: 'string' }, 'bar', mockMeshField);

            function getChildControl(name: string): MeshControl {
                return meshControlGroup.getMeshControlAtPath([]).children.get(name) as MeshControl;
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
        const spy = spyOn(meshControlGroup.getMeshControlAtPath([]), 'getMeshControlAtPath');
        const path = ['foo'];
        meshControlGroup.getMeshControlAtPath(path);

        expect(spy).toHaveBeenCalledWith(path);
    });

});
