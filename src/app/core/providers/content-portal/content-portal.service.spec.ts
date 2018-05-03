import { ContentPortalService } from './content-portal.service';

describe('ContentPortalService', () => {

    const noIdFooError = `No ContentPortal with the id "foo" exists.`;
    let contentPortalService: ContentPortalService;

    beforeEach(() => {
        contentPortalService = new ContentPortalService();
    });

    it('adding and retrieving templateRefs works', () => {
        const templateRef1 = {} as any;
        const templateRef2 = {} as any;
        const id = 'foo';

        contentPortalService.registerPortal(id);
        contentPortalService.addTemplateRef(id, templateRef1);

        expect(contentPortalService.getTemplates(id)).toEqual([templateRef1]);

        contentPortalService.addTemplateRef(id, templateRef2);

        expect(contentPortalService.getTemplates(id)).toEqual([templateRef1, templateRef2]);
    });

    it('removing templateRefs works', () => {
        const templateRef1 = {} as any;
        const templateRef2 = {} as any;
        const id = 'foo';

        contentPortalService.registerPortal(id);
        contentPortalService.addTemplateRef(id, templateRef1);
        contentPortalService.addTemplateRef(id, templateRef2);

        contentPortalService.removeTemplateRef(id, templateRef1);

        expect(contentPortalService.getTemplates(id)).toEqual([templateRef2]);
    });

    describe('errors', () => {

        it('registerPortal() throws when attempting to register same id more than once', () => {
            const registerFoo = () => contentPortalService.registerPortal('foo');

            expect(registerFoo).not.toThrow();
            expect(registerFoo).toThrowError(`A ContentPortal with the id "foo" already exists.`);
        });

        it('unregisterPortal() does not throw when portal id registered', () => {
            contentPortalService.registerPortal('foo');
            expect(() => contentPortalService.unregisterPortal('foo')).not.toThrow();
        });

        it('unregisterPortal() throws when portal id not registered', () => {
            expect(() => contentPortalService.unregisterPortal('foo')).toThrowError(noIdFooError);
        });

        it('addTemplateRef() throws when portal id not registered', () => {
            expect(() => contentPortalService.addTemplateRef('foo', {} as any)).toThrowError(noIdFooError);
        });

        it('getTemplates() throws when portal id not registered', () => {
            expect(() => contentPortalService.getTemplates('foo')).toThrowError(noIdFooError);
        });
    });


});
