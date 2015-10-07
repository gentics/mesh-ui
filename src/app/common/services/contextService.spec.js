describe('contextService', function() {

    var contextService,
        project,
        node;

    beforeEach(module('meshAdminUi.common'));
    beforeEach(inject(function (_contextService_) {
        contextService = _contextService_;
        project = {
            name: 'someProject',
            uuid: '12345abc'
        };
        node = {
            displayField: 'name',
            uuid: '12345abc',
            fields: {
                name: 'someNode'
            }
        };

        jasmine.clock().install();
    }));

    afterEach(function() {
        jasmine.clock().uninstall();
    });

    it('setProject() should set current project', function() {
        contextService.setProject(project);

        expect(contextService.getProject()).toEqual(project);
    });

    it('setParentNode() should set current node', function() {
        contextService.setCurrentNode(node);

        expect(contextService.getCurrentNode()).toEqual(node);
    });

    it('should call change handlers with correct args', function() {
        var handler = jasmine.createSpy('handler');
        contextService.registerContextChangeHandler(handler);

        contextService.setProject(project);

        jasmine.clock().tick(1);

        expect(handler).toHaveBeenCalledWith(project, {});
    });

    it('should only call change handlers once per event loop', function() {
        var handler = jasmine.createSpy('handler');
        contextService.registerContextChangeHandler(handler);

        contextService.setProject(project);
        contextService.setProject(project);
        contextService.setCurrentNode(node);
        contextService.setCurrentNode(node);

        jasmine.clock().tick(1);

        expect(handler.calls.count()).toEqual(1);
    });

});
