describe('contextService', function() {

    var contextService,
        dispatcher,
        project,
        node;

    beforeEach(module('meshAdminUi.common'));
    beforeEach(inject(function (_contextService_, _dispatcher_) {
        contextService = _contextService_;
        dispatcher = _dispatcher_;
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

    it('should only send change event once per event loop', function() {
        spyOn(dispatcher, 'publish');

        contextService.setProject(project);
        contextService.setProject(project);
        contextService.setCurrentNode(node);
        contextService.setCurrentNode(node);

        jasmine.clock().tick(1);

        expect(dispatcher.publish.calls.count()).toEqual(1);
    });

});
