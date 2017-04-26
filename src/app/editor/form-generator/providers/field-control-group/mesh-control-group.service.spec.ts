import { TestBed } from '@angular/core/testing';
import { MeshControlGroupService } from './mesh-control-group.service';
import { MeshControl } from './mesh-control.class';
import createSpy = jasmine.createSpy;
import Spy = jasmine.Spy;

describe('MeshControlGroupService', () => {

    let meshControlGroup: MeshControlGroupService;
    let mockGetNodeFn: Spy;
    const INIT_ERROR = 'No rootControl was set. Did you forget to call MeshControlGroup.init()?';
    const INIT_ERROR_GET_NODE = 'No getNodeFn was set. Did you forget to call MeshControlGroup.init()?';

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MeshControlGroupService]
        });

        meshControlGroup = TestBed.get(MeshControlGroupService);
        mockGetNodeFn = createSpy('getNodeFn');
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

    it('calling getNode() before init() throws an exception', () => {
        expect(() => meshControlGroup.getNodeValue()).toThrowError(INIT_ERROR_GET_NODE);
    });

    it('accessing isValid before init() returns false', () => {
        expect(meshControlGroup.isValid).toBe(false);
    });

    it('addControl() adds a control with named key to the _rootControl', () => {
        meshControlGroup.init(mockGetNodeFn);

        expect((meshControlGroup.getMeshControlAtPath([]) as MeshControl).children.size).toBe(0);

        const mockMeshField: any = {};
        const mockFieldDef: any = {
            name: 'test',
            type: 'string'
        };
        meshControlGroup.addControl(mockFieldDef, 'foo', mockMeshField);

        expect((meshControlGroup.getMeshControlAtPath([]) as MeshControl).children.size).toBe(1);
        const meshControl = (meshControlGroup.getMeshControlAtPath([]) as MeshControl).children.get('test') as MeshControl;
        expect(meshControl.meshField).toBe(mockMeshField);
    });

    describe('checkValue()', () => {

        let nameControl: MeshControl;
        let friendsControl: MeshControl;
        let friend1Control: MeshControl;
        let friend2Control: MeshControl;

        beforeEach(() => {
            meshControlGroup.init(mockGetNodeFn);

            expect((meshControlGroup.getMeshControlAtPath([]) as MeshControl).children.size).toBe(0);

            const mockMeshField: any = { valueChange: () => undefined };
            meshControlGroup.addControl({ name: 'name', type: 'string' }, 'joe', mockMeshField);
            meshControlGroup.addControl({ name: 'friends', type: 'list', listType: 'string' }, ['peter', 'susan'], mockMeshField);

            function getChildControl(name: string): MeshControl {
                return (meshControlGroup.getMeshControlAtPath([]) as MeshControl).children.get(name) as MeshControl;
            }

            nameControl = getChildControl('name');
            friendsControl = getChildControl('friends');
            friend1Control = friendsControl.addChild({ name: '0', type: 'string' }, 'peter', mockMeshField);
            friend2Control = friendsControl.addChild({ name: '1', type: 'string' }, 'susan', mockMeshField);

            spyOn(nameControl, 'checkValue').and.callThrough();
            spyOn(friendsControl, 'checkValue').and.callThrough();
            spyOn(friend1Control, 'checkValue').and.callThrough();
            spyOn(friend2Control, 'checkValue').and.callThrough();
        });

        it('invokes checkValue() recursively for all matching keys if no propertyChanged path is specified', () => {
            meshControlGroup.checkValue({ name: 'jim', friends: ['quux', 'jane'] });

            expect(nameControl.checkValue).toHaveBeenCalledTimes(1);
            expect(friendsControl.checkValue).toHaveBeenCalledTimes(1);
            expect(friend1Control.checkValue).toHaveBeenCalledTimes(1);
            expect(friend2Control.checkValue).toHaveBeenCalledTimes(1);
        });

        it('invokes checkValue() on controls in the propertyChanged path ', () => {
            meshControlGroup.checkValue({ name: 'jim', friends: ['quux', 'jane'] }, ['name']);

            expect(nameControl.checkValue).toHaveBeenCalledTimes(1);
            expect(friendsControl.checkValue).toHaveBeenCalledTimes(0);
            expect(friend1Control.checkValue).toHaveBeenCalledTimes(0);
            expect(friend2Control.checkValue).toHaveBeenCalledTimes(0);
        });

        it('invokes checkValue() recursively on all controls in the propertyChanged path ', () => {
            meshControlGroup.checkValue({ name: 'jim', friends: ['quux', 'jane'] }, ['friends', 1]);

            expect(nameControl.checkValue).toHaveBeenCalledTimes(0);
            expect(friendsControl.checkValue).toHaveBeenCalledTimes(1);
            expect(friend1Control.checkValue).toHaveBeenCalledTimes(0);
            expect(friend2Control.checkValue).toHaveBeenCalledTimes(1);
        });

        it('ignores non-matching keys', () => {
            meshControlGroup.checkValue({ nonMatching: 'quux', test5: 'bar' });
            meshControlGroup.checkValue({ bad: 12 });

            expect(nameControl.checkValue).toHaveBeenCalledTimes(0);
            expect(friendsControl.checkValue).toHaveBeenCalledTimes(0);
        });

    });

    describe('getNodeValue()', () => {

        it('invokes the getNodeFn registered in the init() method', () => {
            const path = ['foo'];
            meshControlGroup.init(mockGetNodeFn);
            expect(mockGetNodeFn).not.toHaveBeenCalled();
            meshControlGroup.getNodeValue(path);
            expect(mockGetNodeFn).toHaveBeenCalledTimes(1);
            expect(mockGetNodeFn).toHaveBeenCalledWith(path);
        });
    });

    describe('nodeChanged()', () => {

        it('invokes nodeChanged() on the root MeshControl', () => {
            const path = ['foo'];
            const value = 'bar';
            const node = {} as any;
            meshControlGroup.init(mockGetNodeFn);
            const rootControl = meshControlGroup.getMeshControlAtPath([]) as MeshControl;
            rootControl.nodeChanged = createSpy('nodeChanged');

            meshControlGroup.nodeChanged(path, value, node);
            expect(rootControl.nodeChanged).toHaveBeenCalledWith(path, value, node);
        });

    });

    it('formWidthChanged() invokes formWidthChanged() on root MeshControl', () => {
        meshControlGroup.init(mockGetNodeFn);
        const rootControl = meshControlGroup.getMeshControlAtPath([]) as MeshControl;
        rootControl.formWidthChanged = createSpy('formWidthChanged');

        meshControlGroup.formWidthChanged(123);

        expect(rootControl.formWidthChanged).toHaveBeenCalledWith(123);
    });

    it('getMeshControlAtPath() invokes _rootControl.getMeshControlAtPath()', () => {
        meshControlGroup.init(mockGetNodeFn);
        const spy = spyOn(meshControlGroup.getMeshControlAtPath([]) as MeshControl, 'getMeshControlAtPath');
        const path = ['foo'];
        meshControlGroup.getMeshControlAtPath(path);

        expect(spy).toHaveBeenCalledWith(path);
    });

});
