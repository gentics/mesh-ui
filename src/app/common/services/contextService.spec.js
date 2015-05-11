describe('contextService', function() {

    var contextService,
        project,
        tag;

    beforeEach(module('meshAdminUi.common'));
    beforeEach(inject(function (_contextService_) {
        contextService = _contextService_;
        project = {
            name: 'someProject',
            id: '12345abc'
        };
        tag = {
            name: 'someTag',
            id: '12345abc'
        };
    }));

    it('setProject() should set current project', function() {
        contextService.setProject(project.name, project.id);

        expect(contextService.getProject()).toEqual(project);
    });

    it('setTag() should set current tag', function() {
        contextService.setTag(tag.name, tag.id);

        expect(contextService.getTag()).toEqual(tag);
    });

    it('should call change handlers with correct args', function() {
        var handler = jasmine.createSpy('handler');
        contextService.registerContextChangeHandler(handler);

        contextService.setProject(project.name, project.id);
        expect(handler).toHaveBeenCalledWith(project, { name: '', id: '' });

        contextService.setTag(tag.name, tag.id);
        expect(handler.calls.count()).toBe(2);
    });
    
});
