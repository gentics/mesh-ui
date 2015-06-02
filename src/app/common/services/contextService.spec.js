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
            id: '12345abc'
        };
    }));

    it('setProject() should set current project', function() {
        contextService.setProject(project.name, project.id);

        expect(contextService.getProject()).toEqual(project);
    });

    it('setParentNode() should set current node', function() {
        contextService.setParentNode(node.id);

        expect(contextService.getParentNode()).toEqual(node);
    });

    it('should call change handlers with correct args', function() {
        var handler = jasmine.createSpy('handler');
        contextService.registerContextChangeHandler(handler);

        contextService.setProject(project.name, project.id);
        expect(handler).toHaveBeenCalledWith(project, { id: '' });

        contextService.setParentNode(node.id);
        expect(handler.calls.count()).toBe(2);
    });
    
});
