describe('contextService', function() {

    var contextService,
        project,
        node;

    beforeEach(module('meshAdminUi.common'));
    beforeEach(inject(function (_contextService_) {
        contextService = _contextService_;
        project = {
            name: 'someProject',
            id: '12345abc'
        };
        node = {
            name: 'someNode',
            id: '12345abc'
        };

        jasmine.clock().install();
    }));

    afterEach(function() {
        jasmine.clock().uninstall();
    });

    it('setProject() should set current project', function() {
        contextService.setProject(project.name, project.id);

        expect(contextService.getProject()).toEqual(project);
    });

    it('setParentNode() should set current node', function() {
        contextService.setParentNode(node.name, node.id);

        expect(contextService.getParentNode()).toEqual(node);
    });

    it('should call change handlers with correct args', function() {
        var handler = jasmine.createSpy('handler');
        contextService.registerContextChangeHandler(handler);

        contextService.setProject(project.name, project.id);

        jasmine.clock().tick(1);

        expect(handler).toHaveBeenCalledWith(project, { name: '', id: '' });
    });

    it('should only call change handlers once per event loop', function() {
        var handler = jasmine.createSpy('handler');
        contextService.registerContextChangeHandler(handler);

        contextService.setProject(project.name, project.id);
        contextService.setProject(project.name, project.id);
        contextService.setParentNode(node.name, node.id);
        contextService.setParentNode(node.name, node.id);

        jasmine.clock().tick(1);

        expect(handler.calls.count()).toEqual(1);
    });

});
