describe('wipService', function() {

    var wipService,
        itemType,
        testItem;

    beforeEach(module('meshAdminUi.common'));
    beforeEach(inject(function (_wipService_) {
        wipService = _wipService_;
        testItem = {
            uuid: 'some_uuid',
            name: 'Item One'
        };
        itemType = 'testType';
    }));

    it('should be initially empty.', function() {
        expect(wipService.getOpenItems(itemType)).toEqual([]);
    });

    it('should add an item to the store with openItem()', function() {
        wipService.openItem(itemType, testItem);

        var openItems = wipService.getOpenItems(itemType);

        expect(openItems.length).toBe(1);
        expect(openItems[0].item.name).toEqual(testItem.name);
    });

    it('should store metadata if passed to openItem()', function() {
        var myMetadata = { foo: 'bar' };
        wipService.openItem(itemType, testItem, myMetadata);

        expect(wipService.getMetadata(itemType, testItem.uuid)).toEqual(myMetadata);
    });

    it('should add new metadata with setMetadata()', function() {
        wipService.openItem(itemType, testItem);
        wipService.setMetadata(itemType, testItem.uuid, 'quux', 'bax');

        expect(wipService.getMetadata(itemType, testItem.uuid)).toEqual({ quux: 'bax'});
    });

    it('should modify existing metadata with setMetadata()', function() {
        wipService.openItem(itemType, testItem, { foo: 'bar' });
        wipService.setMetadata(itemType, testItem.uuid, 'foo', 'fubar');

        expect(wipService.getMetadata(itemType, testItem.uuid)).toEqual({ foo: 'fubar'});
    });

    it('should remove the item from the store with closeItem()', function() {
        wipService.openItem(itemType, testItem);
        wipService.closeItem(itemType, testItem);

        expect(wipService.getOpenItems(itemType)).toEqual([]);
    });

    it('should return a specific item with getItem()', function() {
        wipService.openItem(itemType, testItem);

        expect(wipService.getItem(itemType, testItem.uuid)).toBe(testItem);
    });

    it('should return undefined with getItem() if uuid not found', function() {
        wipService.openItem(itemType, testItem);

        expect(wipService.getItem(itemType, 'nonExistentId')).toBeUndefined();
    });

    describe('change tracking', function() {

        beforeEach(function() {
            wipService.openItem(itemType, testItem);
        });

        it('should mark item as modified with setAsModified()', function() {
            expect(wipService.isModified(itemType, testItem)).toBe(false);
            wipService.setAsModified(itemType, testItem);
            expect(wipService.isModified(itemType, testItem)).toBe(true);
        });

        it('should mark item as unmodified with setAsUnmodified()', function() {
            wipService.setAsModified(itemType, testItem);
            expect(wipService.isModified(itemType, testItem)).toBe(true);
            wipService.setAsUnmodified(itemType, testItem);
            expect(wipService.isModified(itemType, testItem)).toBe(false);
        });

        it('should not alter the original item when marking as modified', function() {
            var original = angular.copy(testItem);
            wipService.setAsModified(itemType, testItem);

            expect(testItem).toEqual(original);
        });

        it('should list all modified with getModifiedItems()', function() {
            var secondItem = {
                uuid: 'foobar'
            };
            wipService.openItem(itemType, secondItem);

            wipService.setAsModified(itemType, testItem);
            expect(wipService.getModifiedItems(itemType)).toEqual([testItem.uuid]);

            wipService.setAsModified(itemType, secondItem);
            expect(wipService.getModifiedItems(itemType)).toEqual([testItem.uuid, secondItem.uuid]);

        });

        it('should correctly list modified items after setting to unmodified', function() {
            wipService.setAsModified(itemType, testItem);
            wipService.setAsUnmodified(itemType, testItem);

            expect(wipService.getModifiedItems(itemType)).toEqual([]);
        });

        it('should remove an item from modified list if close with closeItem()', function() {
            wipService.setAsModified(itemType, testItem);
            wipService.closeItem(itemType, testItem);
            expect(wipService.getModifiedItems(itemType)).toEqual([]);
        });
    });

    describe('exceptional input', function() {

        it('should throw if item uuid already exists with openItem()', function() {
            function openTwice() {
                wipService.openItem(itemType, testItem);
                wipService.openItem(itemType, testItem);
            }

            expect(openTwice).toThrow();
        });

        it('should throw if item has no uuid on openItem()', function() {
            function addBadItem() {
                wipService.openItem(itemType, { foo: 'bar'});
            }

            expect(addBadItem).toThrow();
        });

        it('should throw if attempting to modify non-existent item', function() {
            function closeItem() { wipService.closeItem(itemType, testItem); }
            function setAsModified() { wipService.setAsModified(itemType, testItem); }
            function setAsUnmodified() { wipService.setAsUnmodified(itemType, testItem); }
            function isModified() { wipService.isModified(itemType, testItem); }

            expect(closeItem).toThrow();
            expect(setAsModified).toThrow();
            expect(setAsUnmodified).toThrow();
            expect(isModified).toThrow();
        });
    });


    describe('change handlers', function() {

        var handlerFn;

        beforeEach(function() {
            wipService.openItem(itemType, testItem);
            handlerFn = jasmine.createSpy('handlerFn');
            wipService.registerWipChangeHandler(handlerFn);
        });

        it('should invoke the callback when an item is added', function() {
            expect(handlerFn).not.toHaveBeenCalled();

            wipService.openItem(itemType, { uuid: 'foo' });
            expect(handlerFn.calls.count()).toBe(1);
        });

        it('should invoke the callback when an item is added', function() {
            wipService.closeItem(itemType, testItem);
            expect(handlerFn.calls.count()).toBe(1);
        });

    });
});