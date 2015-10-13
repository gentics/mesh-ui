describe('dispatcher', function() {

    /** @type {Dispatcher} */
    var dispatcher,
        someFn;

    beforeEach(module('meshAdminUi.common'));
    beforeEach(inject(function (_dispatcher_) {
        dispatcher = _dispatcher_;
        someFn = jasmine.createSpy('someFn');
    }));

    describe('subscribe():', function() {

        it('should throw exception if invalid event specified', function() {
            function test() {
                dispatcher.subscribe('bad_event', someFn);
            }

            expect(test).toThrow();
        });

        it('should not throw exception if valid event specified', function() {
            function test() {
                dispatcher.subscribe(dispatcher.events.loginSuccess, someFn);
            }

            expect(test).not.toThrow();
        });

    });

    describe('publish():', function() {

        it('should throw exception if invalid event specified', function() {
            function test() {
                dispatcher.publish('bad_event');
            }

            expect(test).toThrow();
        });

        it('should not throw exception if valid event specified', function() {
            function test() {
                dispatcher.publish(dispatcher.events.loginSuccess);
            }

            expect(test).not.toThrow();
        });

    });

    describe('pub/sub:', function() {
        var testEvent1,
            testEvent2;

        beforeEach(function() {
            testEvent1 = dispatcher.events.loginSuccess;
            testEvent2 = dispatcher.events.logoutSuccess;
            dispatcher.subscribe(testEvent1, someFn);
        });

        it('should execute the listener once when event is published', function() {
            expect(someFn).not.toHaveBeenCalled();
            dispatcher.publish(testEvent1);
            expect(someFn.calls.count()).toBe(1);
            dispatcher.publish(testEvent1);
            dispatcher.publish(testEvent1);
            expect(someFn.calls.count()).toBe(3);
        });

        it('should not execute the listener when a different event is published', function() {
            expect(someFn).not.toHaveBeenCalled();
            dispatcher.publish(testEvent2);
            expect(someFn).not.toHaveBeenCalled();
        });
    });

    describe('unsubscribeAll():', function() {
        var testEvent1,
            testEvent2;

        beforeEach(function() {
            testEvent1 = dispatcher.events.loginSuccess;
            testEvent2 = dispatcher.events.logoutSuccess;
            dispatcher.subscribe(testEvent1, someFn);
        });

        it('should stop the listener firing on events', function() {
            dispatcher.publish(testEvent1);
            expect(someFn.calls.count()).toBe(1);
            dispatcher.unsubscribeAll(someFn);
            dispatcher.publish(testEvent1);
            expect(someFn.calls.count()).toBe(1);
        });
    });


});
