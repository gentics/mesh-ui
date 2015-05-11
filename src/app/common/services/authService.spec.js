describe('authService', function() {

    var authService;

    beforeEach(module('meshAdminUi.common'));
    beforeEach(inject(function(_authService_) {
        authService = _authService_;
    }));

    it('should not be logged in initially', function() {
        expect(authService.isLoggedIn).toBe(false);
    });

    it('should log in with correct credentials', function() {
        authService.logIn('admin', 'admin');

        expect(authService.isLoggedIn).toBe(true);
    });

    it('should not log in with incorrect credentials', function() {
        authService.logIn('incorrect', 'credentials');

        expect(authService.isLoggedIn).toBe(false);
    });

    it('should log out', function() {
        authService.logIn('admin', 'admin');
        authService.logOut();

        expect(authService.isLoggedIn).toBe(false);
    });

    it('should invoke handlers on login', function() {
        var handlerOne = jasmine.createSpy('handlerOne'),
            handlerTwo = jasmine.createSpy('handlerTwo');

        authService.registerLogInHandler(handlerOne);
        authService.registerLogInHandler(handlerTwo);
        authService.logIn('admin', 'admin');

        expect(handlerOne).toHaveBeenCalled();
        expect(handlerTwo).toHaveBeenCalled();
    });

    it('should invoke handlers on logout', function() {
        var handlerOne = jasmine.createSpy('handlerOne'),
            handlerTwo = jasmine.createSpy('handlerTwo');

        authService.registerLogOutHandler(handlerOne);
        authService.registerLogOutHandler(handlerTwo);
        authService.logIn('admin', 'admin');
        authService.logOut();

        expect(handlerOne).toHaveBeenCalled();
        expect(handlerTwo).toHaveBeenCalled();
    });
});